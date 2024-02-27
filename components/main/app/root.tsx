"use client";

import { Calculate } from "./calculate";
import { WebDownload } from "./web-download";

import { Result } from "./result/root";
import { UserInput } from "./userinput/root";

import { iResponseStatus, iResponseQueryDps, ClsUserInput } from "@/components/definitions";

import { useState } from "react";

export const App = ({ status }: { status: iResponseStatus["data"] }) => {
    const [userinput, setUserinput] = useState<ClsUserInput>(new ClsUserInput());
    const [dps, setDPS] = useState<iResponseQueryDps["data"] | undefined>();

    return (
        <div className="flex flex-col w-full justify-center items-center m-6 gap-8 md:w-4/5 lg:w-2/3 xl:w-1/2 2xl:w-full 2xl:flex-row">
            <WebDownload />
            <div className="flex flex-col w-full justify-center items-center gap-8 2xl:basis-1/3">
                <UserInput status={status.userinput} state={userinput} setState={setUserinput} />
                <Calculate userinput={userinput} setDPS={setDPS} />
            </div>
            <div className="flex flex-col w-full justify-center items-center gap-8 2xl:basis-2/3">
                <Result dps={dps} />
            </div>
        </div>
    );
};
