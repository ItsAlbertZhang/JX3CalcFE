"use client";

import { readText } from "@tauri-apps/api/clipboard";
import { open } from "@tauri-apps/api/dialog";
import { getClient, ResponseType } from "@tauri-apps/api/http";
import { invoke } from "@tauri-apps/api/tauri";

export async function isApp() {
    try {
        await readText();
        return true;
    } catch {
        return false;
    }
}

export async function readClipboard() {
    let ret = "";
    try {
        const text = await readText();
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

export async function config() {
    try {
        const result = await open({ directory: true, multiple: false });
        const path = result as string;
        if (path.endsWith("JX3")) {
            const obj = {
                JX3Dir: path,
            };
            return await invoke<boolean>("config", { body: JSON.stringify(obj) });
        }
    } catch (error) {
        console.error(error);
    }
    return false;
}

export async function fetchGetJson({
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
        const client = await getClient();
        ret = (await client.get(url, { responseType: ResponseType.JSON })).data;
    }
    return ret;
}

export async function fetchPostJson({
    host = window.location.hostname,
    port = undefined,
    path,
    body,
}: {
    host?: string;
    port?: number;
    path: string;
    body: object;
}) {
    let ret = undefined;
    const protocal = host.endsWith("localhost") ? "http:" : window.location.protocol;
    const url = protocal + "//" + host + (port ? ":" + port : "") + path;
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
        });
        ret = await response.json();
    } catch {}
    return ret;
}

export async function createTask(input: object) {
    console.log(JSON.stringify(input));
    const data = await fetchPostJson({ port: 12897, path: "/create", body: input });
    console.log(data);
    return data;
}

export async function queryDps(id: string) {
    return await fetchGetJson({ port: 12897, path: `/query/${id}/dps` });
}
