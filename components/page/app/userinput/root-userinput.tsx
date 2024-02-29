"use client";

import { Attribute } from "./attribute";
import { Effects } from "./effects";
import { Global } from "./global";

import { iResponseStatus, ClsUserInput } from "@/components/definitions";

import { Spacer } from "@nextui-org/react";

export const UserInput = ({
    status,
    state,
    setState,
}: {
    status: iResponseStatus["data"]["userinput"];
    state: ClsUserInput;
    setState: (value: ClsUserInput) => void;
}) => {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-8">
            <Global status={status} state={state} setState={setState} />
            <Attribute state={state} setState={setState} />
            <Effects state={state} setState={setState} />
        </div>
    );
};
