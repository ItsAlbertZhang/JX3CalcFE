// Page Component: UserInput: Global
"use client";

import { ClsUserInput } from "./definitions";
import { UIInteger } from "./pc-userinput-base";
import { Select, SelectItem } from "@nextui-org/react";

const UIPlayer = ({ state, setState }: { state: ClsUserInput; setState: (value: ClsUserInput) => void }) => {
    const player = ["焚影圣诀"];
    return (
        <Select
            size="sm"
            label="心法"
            defaultSelectedKeys={[state.player]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setState({ ...state, player: e.target.value });
            }}
        >
            {player.map((item) => (
                <SelectItem key={item} value={item}>
                    {item}
                </SelectItem>
            ))}
        </Select>
    );
};

export const UIGlobal = ({ state, setState }: { state: ClsUserInput; setState: (value: ClsUserInput) => void }) => {
    const cn = "flex justify-center items-center h-full w-full gap-4";
    return (
        <>
            <UIPlayer state={state} setState={setState} />
            <div className={cn}>
                <UIInteger state={state} setState={setState} keys={["delayNetwork"]} label="网络延迟" />
                <UIInteger state={state} setState={setState} keys={["delayKeyboard"]} label="按键延迟" />
            </div>
            <div className={cn}>
                <UIInteger state={state} setState={setState} keys={["fightTime"]} label="战斗时间" />
                <UIInteger state={state} setState={setState} keys={["fightCount"]} label="战斗次数" />
            </div>
        </>
    );
};
