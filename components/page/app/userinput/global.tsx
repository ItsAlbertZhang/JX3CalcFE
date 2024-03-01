"use client";
// child components simple
import { IntegerInput } from "./base";
// my libraries
import { ContextBRStatus, ContextUserinput } from "@/components/context";
import { ibrStatus } from "@/components/definitions";
// third party libraries
import { Select, SelectItem } from "@nextui-org/react";
import { useContext } from "react";

const Player = () => {
    const { value, setValue } = useContext(ContextUserinput);
    const player = ["焚影圣诀"];
    return (
        <Select
            size="sm"
            label="心法"
            defaultSelectedKeys={[value.player]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setValue({ ...value, player: e.target.value });
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

export const Global = () => {
    const { value, setValue } = useContext(ContextUserinput);
    const status = (useContext(ContextBRStatus) as ibrStatus["data"]).userinput;
    return (
        <div className="flex flex-col w-full justify-center items-center gap-4">
            <Player />
            <div className="grid grid-cols-2 gap-4 w-full items-center">
                <IntegerInput
                    state={value}
                    setState={setValue}
                    keys={["delayNetwork"]}
                    label="网络延迟"
                    max={status.maxDelayNetwork}
                />
                <IntegerInput
                    state={value}
                    setState={setValue}
                    keys={["delayKeyboard"]}
                    label="按键延迟"
                    max={status.maxDelayKeyboard}
                />
                <IntegerInput
                    state={value}
                    setState={setValue}
                    keys={["fightTime"]}
                    label="战斗时间"
                    max={status.maxFightTime}
                />
                <IntegerInput
                    state={value}
                    setState={setValue}
                    keys={["fightCount"]}
                    label="计算次数"
                    max={status.maxFightCount}
                />
            </div>
        </div>
    );
};
