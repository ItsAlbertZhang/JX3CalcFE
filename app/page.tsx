"use client";

import { config } from "./actions";
import { App } from "./pc-app";
import { Button, Card, CardBody, Spacer, Spinner } from "@nextui-org/react";
import { useState, useEffect } from "react";

const PageLoading = () => {
    return <Spinner label="加载中..." />;
};

const PageVersionInvalid = () => {
    return (
        <Card>
            <CardBody className="items-center">
                <Spinner />
                <Spacer y={4} />
                <p>发现新版本</p>
                <p>正在尝试自动更新, 请保持网络畅通</p>
            </CardBody>
        </Card>
    );
};

const PageConfig = ({ setStatus }: { setStatus: (value: boolean) => void }) => {
    async function handleOpen() {
        setStatus(await config());
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
