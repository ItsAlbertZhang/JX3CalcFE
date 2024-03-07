"use client";
// my libraries
import { config, fetchGetJson, isApp } from "@/components/actions";
import { ibrStatus } from "@/components/definitions";
// third party libraries
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export async function fetchServerStatus() {
    console.log("fetching server status...");
    try {
        return (await fetchGetJson({ port: 12897, path: "/status" })) as ibrStatus;
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchServerStatus();
    }
}

export const Setting = ({ setStatus }: { setStatus: (value: ibrStatus) => void }) => {
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
                <Button onPress={handleOpen}>选择游戏路径</Button>
                <p>请选择名称为 JX3 的文件夹</p>
            </>
        );
    } else {
        ret = <p>无法在网页端配置</p>;
    }

    return <div className="flex flex-col justify-center items-center gap-4">{ret}</div>;
};
