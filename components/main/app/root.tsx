"use client";

import { Calculate } from "./calculate";
import { WebDownload } from "./web-download";

import { Result } from "./result/root";
import { UserInput } from "./userinput/root";

import { iResponseStatus, iResponseQueryDps, ClsUserInput } from "@/components/definitions";

import { Spacer } from "@nextui-org/react";
import { useState } from "react";

export const App = ({ status }: { status: iResponseStatus["data"] }) => {
    const [userinput, setUserinput] = useState<ClsUserInput>(new ClsUserInput());
    const [result, setResult] = useState<iResponseQueryDps | object>({});

    return (
        <>
            <WebDownload />
            <UserInput status={status.userinput} state={userinput} setState={setUserinput} />
            <Spacer y={4} />
            <Calculate userinput={userinput} setResult={setResult} />
            <Result Dps={result} />
        </>
    );
};
