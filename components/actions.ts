"use client";

import { getVersion as tauri_app_getVersion } from "@tauri-apps/api/app";
import { getClient as tauri_http_getClient, ResponseType as tauri_http_ResponseType } from "@tauri-apps/api/http";
import { open as tauri_dialog_open } from "@tauri-apps/api/dialog";
import { open as tauri_shell_open } from "@tauri-apps/api/shell";
import { readText as tauri_clipboard_readText } from "@tauri-apps/api/clipboard";
import { readTextFile as tauri_fs_readTextFile } from "@tauri-apps/api/fs";
import { invoke as tauri_invoke } from "@tauri-apps/api/tauri";
import { DataInput, TypeBackendRes } from "./definitions";

const tauri = {
    app: {
        getVersion: tauri_app_getVersion,
    },
    clipboard: {
        readText: tauri_clipboard_readText,
    },
    dialog: {
        open: tauri_dialog_open,
    },
    fs: {
        readTextFile: tauri_fs_readTextFile,
    },
    http: {
        getClient: tauri_http_getClient,
        ResponseType: tauri_http_ResponseType,
    },
    shell: {
        open: tauri_shell_open,
    },
    tauri: {
        invoke: tauri_invoke,
    },
};

// 环境判断函数

export async function isApp() {
    try {
        await tauri.app.getVersion();
        return true;
    } catch {
        return false;
    }
}

// 跨环境函数

export async function fetchGet({
    host = window.location.hostname,
    port = undefined,
    path,
}: {
    host?: string;
    port?: number;
    path: string;
}) {
    /** 备注:
     *  tauri api 在非 tauri app 环境下无法使用.
     *  fetch 在 tauri app 的 build 环境下无法访问 localhost 以外的地址.
     *  tauri dev 环境下的 protocal//hostname 为 http://localhost.
     *  tauri build 环境下的 protocal//hostname 为 https://tauri.localhost.
     */
    let ret = undefined;
    const protocal = (await isApp()) ? "http:" : window.location.protocol;
    const url = protocal + "//" + host + (port ? ":" + port : "") + path;
    try {
        const response = await fetch(url);
        ret = await response.json();
    } catch {
        const client = await tauri.http.getClient();
        ret = (await client.get(url, { responseType: tauri.http.ResponseType.JSON })).data;
    }
    return ret;
}

export async function fetchPost({
    host = window.location.hostname,
    port = undefined,
    path,
    body,
}: {
    host?: string;
    port?: number;
    path: string;
    body: object | string;
}) {
    let ret = undefined;
    const protocal = host.endsWith("localhost") ? "http:" : window.location.protocol;
    const url = protocal + "//" + host + (port ? ":" + port : "") + path;
    try {
        const response = await fetch(url, {
            method: "POST",
            body: typeof body === "string" ? body : JSON.stringify(body),
        });
        ret = await response.json();
    } catch {
        // 暂时不做使用 tauri api 的处理, 因为 fetch 可以发 localhost 的 post
    }
    return ret;
}

export async function openUrl(url: string) {
    try {
        await tauri.shell.open(url);
    } catch {
        window.open(url, "_blank");
    }
}

export async function readClipboard() {
    let ret = "";
    try {
        const text = await tauri.clipboard.readText();
        if (text !== null) {
            ret = text;
        }
    } catch {
        try {
            ret = await navigator.clipboard.readText();
        } catch {
            console.error("getClipboard failed");
        }
    }
    return ret;
}

export async function readLua() {
    try {
        const result = await tauri.dialog.open({
            multiple: false,
            filters: [
                {
                    name: "Lua",
                    extensions: ["lua"],
                },
            ],
        });
        if (result === null) {
            return "";
        }
        const path = result as string;
        return await tauri.fs.readTextFile(path);
    } catch (error) {
        console.error(error);
    }
    return "";
}

// tauri only

export async function config() {
    try {
        const result = await tauri.dialog.open({ directory: true, multiple: false });
        const path = result as string;
        if (path.endsWith("bin64")) {
            const obj = {
                JX3Dir: path,
            };
            return await tauri.tauri.invoke<boolean>("config", { body: JSON.stringify(obj) });
        }
    } catch (error) {
        console.error(error);
    }
    return false;
}

// 其他函数

export async function createTask(input: string) {
    // const obj = {
    //     ...input,
    //     attribute: {
    //         ...input.attribute,
    //         data: {
    //             ...input.attribute.data,
    //             MeleeWeaponDamageRand:
    //                 input.attribute.data.MeleeWeaponDamageMax - input.attribute.data.MeleeWeaponDamage,
    //         },
    //     },
    // };
    // console.log(JSON.stringify(obj));
    // const data = await fetchPost({ port: 12897, path: "/create", body: obj });
    // console.log(data);
    // return data;
    console.log(input);
    const data = await fetchPost({ port: 12897, path: "/create", body: input });
    console.log(data);
    return data as TypeBackendRes;
}

export async function queryDps(id: string) {
    return (await fetchGet({ port: 12897, path: `/query/${id}/dps` })) as TypeBackendRes;
}

export async function queryDamageList(id: string) {
    return (await fetchGet({ port: 12897, path: `/query/${id}/damage-list` })) as TypeBackendRes;
}

export async function queryDamageAnalysis(id: string) {
    return (await fetchGet({ port: 12897, path: `/query/${id}/damage-analysis` })) as TypeBackendRes;
}
