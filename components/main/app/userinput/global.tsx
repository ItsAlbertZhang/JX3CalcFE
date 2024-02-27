"use client";

import { IntegerInput } from "./base";

import { iResponseStatus, ClsUserInput } from "@/components/definitions";

import { Select, SelectItem } from "@nextui-org/react";

const Player = ({ state, setState }: { state: ClsUserInput; setState: (value: ClsUserInput) => void }) => {
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

export const Global = ({
    status,
    state,
    setState,
}: {
    status: iResponseStatus["data"]["userinput"];
    state: ClsUserInput;
    setState: (value: ClsUserInput) => void;
}) => {
    const cn = "flex justify-center items-center w-full gap-4";
    return (
        <div className="flex flex-col w-full justify-center items-center gap-4">
            <Player state={state} setState={setState} />
            <div className="grid grid-cols-2 gap-4 w-full items-center">
                <IntegerInput
                    state={state}
                    setState={setState}
                    keys={["delayNetwork"]}
                    label="网络延迟"
                    max={status.maxDelayNetwork}
                />
                <IntegerInput
                    state={state}
                    setState={setState}
                    keys={["delayKeyboard"]}
                    label="按键延迟"
                    max={status.maxDelayKeyboard}
                />
                <IntegerInput
                    state={state}
                    setState={setState}
                    keys={["fightTime"]}
                    label="战斗时间"
                    max={status.maxFightTime}
                />
                <IntegerInput
                    state={state}
                    setState={setState}
                    keys={["fightCount"]}
                    label="计算次数"
                    max={status.maxFightCount}
                />
            </div>
        </div>
    );
};
