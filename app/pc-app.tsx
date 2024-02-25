// Page Component: App
"use client";

import { UserInput, iUserInput } from "./pc-userinput";
import { Result, iResultDps } from "./pc-result";
import { Button } from "@nextui-org/react";
import { useState } from "react";

interface iResponseBase {
    status: number;
    data: any;
}
interface iResponseString extends iResponseBase {
    data: string;
}

async function create(input: object) {
    const response = await fetch(`http://${window.location.hostname}:12897/create`, {
        method: "POST",
        body: JSON.stringify(input),
    });
    console.log(response);
    console.log(JSON.stringify(input));
    const data = await response.json();
    console.log(data);
    return data as iResponseString;
}

async function queryDps(id: string) {
    const response = await fetch(`http://${window.location.hostname}:12897/query/${id}/dps`);
    const data = await response.json();
    return data as iResponseBase;
}

const Calculate = ({ userinput, setResult }: { userinput: object; setResult: (value: iResultDps) => void }) => {
    const [clickDisabled, setClickDisabled] = useState(false);
    async function handleClick() {
        try {
            const response = await create(userinput);
            if (response.status === 0) {
                setClickDisabled(true);
                const id = response.data;
                let complete = false;
                while (!complete) {
                    const response = await queryDps(id);
                    if (response.status === 0) {
                        const data = response.data as iResultDps["data"];
                        complete = data.complete;
                        setResult(response);
                    }
                    if (!complete) {
                        await new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                }
                setClickDisabled(false);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Button isDisabled={clickDisabled} onClick={handleClick} color="primary">
            计算
        </Button>
    );
};

export const App = () => {
    const [userinput, setUserinput] = useState<iUserInput>({
        player: "焚影圣诀",
        delayNetwork: 45,
        delayKeyboard: 20,
        fightTime: 300,
        fightCount: 100,
        attribute: {},
        effects: ["大附魔·腰", "大附魔·腕", "大附魔·鞋", "套装·技能", "套装·特效", "家园酒·加速"],
    });
    const [result, setResult] = useState<iResultDps | object>({});

    return (
        <>
            <UserInput state={userinput} setState={setUserinput} />
            <Calculate userinput={userinput} setResult={setResult} />
            <Result Dps={result} />
        </>
    );
};
