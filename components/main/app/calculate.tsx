"use client";

import { iResponseBase, iResponseString, iResponseQueryDps } from "@/components/definitions";

import { Button } from "@nextui-org/react";
import { useState } from "react";

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

export const Calculate = ({
    userinput,
    setResult,
}: {
    userinput: object;
    setResult: (value: iResponseQueryDps) => void;
}) => {
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
                        const data = response.data as iResponseQueryDps["data"];
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
