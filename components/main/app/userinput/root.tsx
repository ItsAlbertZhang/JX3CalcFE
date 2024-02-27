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
        <>
            <Global status={status} state={state} setState={setState} />
            <Spacer y={0} />
            <Attribute state={state} setState={setState} />
            <Spacer y={0} />
            <Effects state={state} setState={setState} />
        </>
    );
};
