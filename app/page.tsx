"use client";

import { App } from "./pc-app";
import { Button, Spinner, Card, CardBody } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";

const PageLoading = () => {
    return <Spinner label="加载中..." />;
};

const PageVersionInvalid = () => {
    return (
        <Card>
            <CardBody className="items-center">
                <p>版本不匹配</p>
                <p>请在网络畅通的情况下重启应用以自动更新</p>
            </CardBody>
        </Card>
    );
};

async function config(path: string) {
    const obj = {
        JX3Dir: path,
    };
    const response = await invoke<boolean>("config", { body: JSON.stringify(obj) });
    return;
}

const PageConfig = ({ setStatus }: { setStatus: (value: boolean) => void }) => {
    async function handleOpen() {
        try {
            const result = await open({ directory: true, multiple: false });
            const path = result as string;
            if (path.endsWith("JX3")) {
                config(path);
                setStatus(true);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <Button onClick={handleOpen}>选择游戏路径</Button>
            <p>请选择名称为 JX3 的文件夹</p>
        </>
    );
};

async function validateVersion() {
    console.log("validating version...");
    try {
        const response = await fetch(`http://${window.location.hostname}:12897/version`);
        const data = await response.text();
        return data === "24022501";
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return validateVersion();
    }
}

async function validateAvailable() {
    const response = await fetch(`http://${window.location.hostname}:12897/available`);
    const data = await response.json();
    return data.status === 0;
}

export default function Page() {
    const [serverReady, setServerReady] = useState(false); // 服务器是否已启动
    const [serverVersionValid, setServerVersionValid] = useState(false); // 服务器版本是否匹配
    const [serverAvailable, setServerAvailable] = useState(false); // 服务器是否可用
    useEffect(() => {
        async function f() {
            try {
                const version = await validateVersion();
                setServerVersionValid(version);
                if (version) {
                    const available = await validateAvailable();
                    setServerAvailable(available);
                }
                setServerReady(true);
            } catch (error) {
                console.error(error);
            }
        }
        f();
    }, []);

    let ret: JSX.Element;
    if (!serverReady) {
        ret = <PageLoading />;
    } else if (!serverVersionValid) {
        ret = <PageVersionInvalid />;
    } else if (!serverAvailable) {
        ret = <PageConfig setStatus={setServerAvailable} />;
    } else {
        ret = <App />;
    }
    return (
        <div className="flex flex-col justify-center min-h-screen gap-4 items-center m-auto py-6 w-3/4 sm:w-1/2 lg:w-1/3">
            {ret}
        </div>
    );
}
