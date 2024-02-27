"use client";

import { iResponseStatus } from "./definitions";
import { isApp, config } from "./actions";
import { App } from "./pc-app";
import { Button, Spacer, Spinner } from "@nextui-org/react";
import { useState, useEffect } from "react";

const version = "24022701";

const PageLoading = () => {
    return <Spinner label="加载中..." />;
};

const PageVersionInvalid = () => {
    return (
        <>
            <Spinner />
            <Spacer y={4} />
            <p>发现新版本</p>
            <p>正在尝试自动更新, 请保持网络畅通</p>
        </>
    );
};

const PageConfig = ({ setStatus }: { setStatus: (value: iResponseStatus) => void }) => {
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

async function fetchServerStatus() {
    console.log("fetching server status...");
    try {
        const response = await fetch(`http://${window.location.hostname}:12897/status`);
        return (await response.json()) as iResponseStatus;
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchServerStatus();
    }
}

export default function Page() {
    const [status, setStatus] = useState<iResponseStatus | undefined>();
    useEffect(() => {
        async function f() {
            try {
                setStatus(await fetchServerStatus());
            } catch (error) {
                console.error(error);
            }
        }
        f();
    }, []);

    let ret: JSX.Element;
    if (!status) {
        ret = <PageLoading />;
    } else if (status.status !== 0) {
        ret = <PageConfig setStatus={setStatus} />;
    } else if (status.data.version != version) {
        ret = <PageVersionInvalid />;
    } else {
        ret = <App status={status.data} />;
    }
    return (
        <div className="flex flex-col justify-center min-h-screen gap-4 items-center m-auto py-6 w-3/4 sm:w-1/2 lg:w-1/3">
            {ret}
        </div>
    );
}
