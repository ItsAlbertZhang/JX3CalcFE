"use client";
// my libraries
import { config, fetchGet, isApp } from "@/components/actions";
import { TypeStatus } from "@/components/definitions";
// third party libraries
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export async function fetchServerStatus() {
    console.log("fetching server status...");
    try {
        return (await fetchGet({ port: 12897, path: "/status" })) as TypeStatus;
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchServerStatus();
    }
}

export const Setting = () => {
    const [app, setApp] = useState(false);
    async function handleOpen() {
        await config();
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
                <Button onPress={handleOpen}>选择游戏路径</Button>
                <p>请选择名称为 SeasunGame 的文件夹</p>
            </>
        );
    } else {
        ret = <p>无法在网页端配置</p>;
    }

    return <div className="xl:col-span-3 flex flex-col justify-center items-center gap-4">{ret}</div>;
};
