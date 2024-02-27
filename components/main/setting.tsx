"use client";

import { config, isApp } from "@/components/actions";
import { iResponseStatus } from "@/components/definitions";

import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export async function fetchServerStatus() {
    console.log("fetching server status...");
    try {
        const response = await fetch(`http://${window.location.hostname}:12897/status`);
        return (await response.json()) as iResponseStatus;
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchServerStatus();
    }
}

export const Setting = ({ setStatus }: { setStatus: (value: iResponseStatus) => void }) => {
    const [app, setApp] = useState(false);
    async function handleOpen() {
        if (await config()) {
            setStatus(await fetchServerStatus());
        }
    }

    useEffect(() => {
        async function f() {
            setApp(await isApp());
        }
        f();
    });

    let ret: JSX.Element;
    if (app) {
        ret = (
            <>
                <Button onClick={handleOpen}>选择游戏路径</Button>
                <p>请选择名称为 JX3 的文件夹</p>
            </>
        );
    } else {
        ret = <p>无法在网页端配置</p>;
    }

    return ret;
};
