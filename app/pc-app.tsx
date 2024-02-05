// Page Component: App
"use client";

import { UserInput } from "./pc-userinput";
import { Button, Progress, Spinner, Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";

async function validateVersion() {
    console.log("validating version...");
    try {
        const response = await fetch(`http://${window.location.hostname}:12897/version`);
        const data = await response.text();
        return data === "24022101";
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

interface responseBase {
    status: number;
    data: any;
}
interface responseString extends responseBase {
    data: string;
}
interface queryDpsResponse extends responseBase {
    data: {
        complete: boolean;
        current: number;
        total: number;
        speed: number;
        avg: number;
        sd: number;
        list: number[];
    };
}

async function calculate(input: object) {
    const response = await fetch(`http://${window.location.hostname}:12897/create`, {
        method: "POST",
        body: JSON.stringify(input),
    });
    console.log(response);
    console.log(JSON.stringify(input));
    const data = await response.json();
    console.log(data);
    return data as responseString;
}

async function queryDps(id: string) {
    const response = await fetch(`http://${window.location.hostname}:12897/query/${id}/dps`);
    const data = await response.json();
    return data as responseBase;
}

async function config(path: string) {
    const obj = {
        JX3Dir: path,
    };
    const response = await invoke<boolean>("config", { body: JSON.stringify(obj) });
    return;
}

export function App() {
    const [userinput, setUserinput] = useState({
        player: "",
        delayNetwork: 0,
        delayKeyboard: 0,
        fightTime: 0,
        fightCount: 0,
        attribute: {},
        effects: [],
    });
    const [dps, setDps] = useState({});
    const [clickDisabled, setClickDisabled] = useState(false);

    const [serverReady, setServerReady] = useState(false);
    const [serverVersionValid, setServerVersionValid] = useState(false);
    const [serverAvailable, setServerAvailable] = useState(false);

    useEffect(() => {
        async function f() {
            const version = await validateVersion();
            setServerVersionValid(version);
            if (version) {
                const available = await validateAvailable();
                setServerAvailable(available);
            }
            setServerReady(true);
        }
        f();
    }, []);

    function handleClick() {
        calculate(userinput).then((response) => {
            setClickDisabled(true);
            if (response.status === 0) {
                const id = response.data;
                const interval = setInterval(() => {
                    queryDps(id).then((response) => {
                        if (response.status === 0) {
                            const data = response.data as queryDpsResponse["data"];
                            if (data.complete) {
                                clearInterval(interval);
                                setClickDisabled(false);
                            }
                            setDps(data);
                        }
                    });
                }, 1000);
            }
        });
    }

    const jsxUserInput = <UserInput state={userinput} setState={setUserinput} />;
    const jsxButton = (
        <Button isDisabled={clickDisabled} onClick={handleClick}>
            计算
        </Button>
    );

    let jsxDps = <></>;
    if (Object.keys(dps).length > 0) {
        const data = dps as queryDpsResponse["data"];
        jsxDps = (
            <>
                <Progress aria-label="计算中..." value={(data.current * 100) / data.total} className="max-w-md" />
                <p className="text-2xl">平均DPS: {data.avg}</p>
            </>
        );
    }

    function handleOpen() {
        open({ directory: true, multiple: false }).then((result) => {
            const path = result as string;
            if (path.endsWith("JX3")) {
                config(path);
                setServerAvailable(true);
            }
        });
    }
    const jsxOpen = <Button onClick={handleOpen}>选择游戏路径</Button>;

    let ret;
    if (!serverReady) {
        ret = <Spinner label="加载中..." />;
    } else if (!serverVersionValid) {
        ret = (
            <Card>
                <CardBody className="items-center">
                    <p>版本不匹配</p>
                    <p>请在网络畅通的情况下重启应用以自动更新</p>
                </CardBody>
            </Card>
        );
    } else if (!serverAvailable) {
        ret = (
            <>
                {jsxOpen}
                <p>请选择名称为 JX3 的文件夹</p>
            </>
        );
    } else {
        ret = (
            <>
                {jsxUserInput}
                {jsxButton}
                {jsxDps}
            </>
        );
    }

    return (
        <div className="flex flex-col justify-center min-h-screen gap-4 items-center m-auto py-6 w-3/4 sm:w-1/2 lg:w-1/3">
            {ret}
        </div>
    );
}
