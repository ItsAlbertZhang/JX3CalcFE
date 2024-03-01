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

export async function fetchJson(url: string) {
    let ret = undefined;
    try {
        const response = await getClient();
        ret = (await response.get(url, { responseType: ResponseType.JSON })).data;
    } catch {
        try {
            const response = await fetch(url);
            ret = await response.json();
        } catch {
            console.error("fetchJson failed: " + url);
        }
    }
    return ret;
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
