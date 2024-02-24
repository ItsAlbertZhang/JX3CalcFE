// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::io::Cursor;
#[cfg(windows)]
use std::os::windows::process::CommandExt;
use std::process::Command;
use std::{env, fs};
use tokio::fs::File;
use tokio::io::{self};
#[cfg(windows)]
use winapi::um::winbase::CREATE_NO_WINDOW;

#[tauri::command]
async fn config(body: String) -> bool {
    let client = reqwest::Client::new();
    match client.post("http://127.0.0.1:12898/config").body(body).send().await {
        Ok(res) => res.status() == 200,
        Err(_) => false,
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url_api = "https://api.gitee.com/ItsAlbertZhang/JX3CalcBE/releases/latest";
    let url_download = "https://gitee.com/ItsAlbertZhang/JX3CalcBE/releases/download";

    let bin_dir = dirs::data_dir().expect("Could not find data directory").join("jx3calc");
    std::fs::create_dir_all(&bin_dir).expect("Could not create directory");
    let exe_name = "jx3calc_windows.exe";
    let exe_path = bin_dir.join(&exe_name);
    let dll_name = "gdi.dll";
    let dll_path = bin_dir.join(&dll_name);
    let ver_name = "version.txt";
    let ver_path = bin_dir.join(&ver_name);

    let response_result = reqwest::get(url_api).await;
    match response_result {
        Ok(response) => {
            let json_result = response.json::<serde_json::Value>().await;
            match json_result {
                Ok(json) => {
                    if let Some(body) = json.as_object() {
                        if let Some(release) = body.get("release") {
                            if let Some(tag) = release.get("tag") {
                                if let Some(name) = tag.get("name") {
                                    let tag_name = name.as_str().unwrap();
                                    let exe_url = format!("{}/{}/{}", url_download, tag_name, exe_name);
                                    let dll_url = format!("{}/{}/{}", url_download, tag_name, dll_name);
                                    let version = fs::read_to_string(&ver_path).unwrap_or_else(|_| String::new());
                                    if version != tag_name {
                                        let exe_response = reqwest::get(&exe_url).await?;
                                        let mut exe_out = File::create(&exe_path).await?;
                                        let mut exe_content = Cursor::new(exe_response.bytes().await?);
                                        io::copy(&mut exe_content, &mut exe_out).await?;
                                        let dll_response = reqwest::get(&dll_url).await?;
                                        let mut dll_out = File::create(&dll_path).await?;
                                        let mut dll_content = Cursor::new(dll_response.bytes().await?);
                                        io::copy(&mut dll_content, &mut dll_out).await?;
                                        fs::write(&ver_path, tag_name)?;
                                    }
                                }
                            }
                        }
                    }
                }
                Err(e) => {
                    eprintln!("Failed to parse JSON: {}", e);
                }
            }
        }
        Err(e) => {
            eprintln!("Failed to send request: {}", e);
        }
    }

    let mut command = Command::new(exe_path);
    #[cfg(windows)]
    command.creation_flags(CREATE_NO_WINDOW);
    let mut child = command.spawn()?;

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![config])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(move |_app_handle, event| match event {
            // tauri::RunEvent::Ready { .. } => {
            //     println!("app is ready");
            // }
            tauri::RunEvent::ExitRequested { .. } => {
                println!("app is closing...");
                let _ = tokio::spawn(async {
                    let client = reqwest::Client::new();
                    let _ = client.get("http://127.0.0.1:12898/stop").send().await;
                });
                let _ = child.wait();
            }
            _ => {}
        });

    Ok(())
}
