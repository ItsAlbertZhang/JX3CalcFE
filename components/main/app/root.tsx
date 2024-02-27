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
        <div className="flex flex-col w-full justify-center items-center m-6 gap-8 md:w-4/5 lg:w-2/3 xl:w-1/2 ">
            <WebDownload />
            <UserInput status={status.userinput} state={userinput} setState={setUserinput} />
            <Calculate userinput={userinput} setResult={setResult} />
            <Result Dps={result} />
        </div>
    );
};
