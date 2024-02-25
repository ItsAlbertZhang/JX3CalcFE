// Page Component: UserInput
"use client";

import { ClsUserInput } from "./definitions";
import { UIGlobal } from "./pc-ui-global";
import { UIAttribute } from "./pc-ui-attribute";
import { UIEffects } from "./pc-ui-effects";
import { Spacer } from "@nextui-org/react";

export const UserInput = ({ state, setState }: { state: ClsUserInput; setState: (value: ClsUserInput) => void }) => {
    return (
        <>
            <UIGlobal state={state} setState={setState} />
            <Spacer y={0} />
            <UIAttribute state={state} setState={setState} />
            <Spacer y={0} />
            <UIEffects state={state} setState={setState} />
        </>
    );
};
