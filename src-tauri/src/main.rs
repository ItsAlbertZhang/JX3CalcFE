// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs;
use std::io::Cursor;
#[cfg(windows)]
use std::os::windows::process::CommandExt;
use std::path::PathBuf;
use std::process::Command;
use tokio::fs::File;
use tokio::io;
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

async fn stop() -> () {
    let client = reqwest::Client::new();
    match client.get("http://127.0.0.1:12898/stop").send().await {
        Ok(_) => println!("Server stopped."),
        Err(_) => println!("Server not running."),
    }
}

async fn download() -> Result<PathBuf, Box<dyn std::error::Error>> {
    async fn fetch_remote_version() -> Option<String> {
        println!("Fetching remote version...");
        let api = "https://api.gitee.com/ItsAlbertZhang/JX3CalcBE/releases/latest";
        let response = reqwest::get(api).await.ok()?;
        let json = response.json::<serde_json::Value>().await.ok()?;
        json.get("release")?
            .get("tag")?
            .get("name")?
            .as_str()
            .map(|s| s.to_string())
    }
    let pd_data = dirs::data_dir().ok_or_else(|| "无法获取AppData目录")?.join("jx3calc");
    std::fs::create_dir_all(&pd_data)?;
    let fn_version = "version.txt";
    #[cfg(windows)]
    let fn_exe = "jx3calc_windows.exe";
    #[cfg(windows)]
    let fn_dll = "gdi.dll";
    #[cfg(target_os = "macos")]
    let fn_exe = "jx3calc_macos";
    #[cfg(target_os = "macos")]
    let fn_dll = "libgdi.dylib";
    let pf_version = pd_data.join(fn_version);
    let pf_exe = pd_data.join(fn_exe);
    let pf_dll = pd_data.join(fn_dll);
    let version = fs::read_to_string(&pf_version).unwrap_or_else(|_| String::new());
    match fetch_remote_version().await {
        Some(tag) => {
            if tag != version {
                println!("Downloading version {}...", tag);
                let url = format!("https://gitee.com/ItsAlbertZhang/JX3CalcBE/releases/download/{}/", tag);
                let url_exe = format!("{}{}", url, fn_exe);
                let url_dll = format!("{}{}", url, fn_dll);
                let exe_response = reqwest::get(&url_exe).await?;
                let mut exe_out = File::create(&pf_exe).await?;
                let mut exe_content = Cursor::new(exe_response.bytes().await?);
                io::copy(&mut exe_content, &mut exe_out).await?;
                #[cfg(unix)]
                {
                    use std::os::unix::fs::PermissionsExt;
                    let mut perms = fs::metadata(&pf_exe)?.permissions();
                    perms.set_mode(0o755); // rwxr-xr-x
                    fs::set_permissions(&pf_exe, perms)?;
                }
                let dll_response = reqwest::get(&url_dll).await?;
                let mut dll_out = File::create(&pf_dll).await?;
                let mut dll_content = Cursor::new(dll_response.bytes().await?);
                io::copy(&mut dll_content, &mut dll_out).await?;
                fs::write(&pf_version, tag)?;
            }
        }
        None => {
            // 网络请求失败, 检查 pf_exe 和 pf_dll 是否存在
            if !pf_exe.exists() || !pf_dll.exists() {
                return Err("初次运行, 需要连接至网络以下载资源文件".into());
            }
        }
    }
    Ok(pf_exe)
}

fn main() {
    let rt = tokio::runtime::Runtime::new().expect("Failed to create tokio runtime");
    let pf_exe = rt.block_on(async {
        let _ = stop().await;
        download().await.unwrap()
    });
    let mut command = Command::new(pf_exe);
    #[cfg(windows)]
    command.creation_flags(CREATE_NO_WINDOW);
    let mut child = command.spawn().expect("Failed to start child process");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![config])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(move |_app_handle, event| match event {
            // tauri::RunEvent::Ready { .. } => {
            //     println!("app is ready");
            // }
            tauri::RunEvent::ExitRequested { .. } => {
                println!("App is closing...");
                rt.block_on(stop());
                let _ = child.wait();
            }
            _ => {}
        });
}
