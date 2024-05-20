"use client";
// child components simple
import { IntegerInput } from "./Common";
// my libraries
import { DataInput, TypeStatus } from "@/components/definitions";
// third party libraries
import { Select, SelectItem } from "@nextui-org/react";

const Player = ({
    dataInput,
    updateInput,
}: {
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
}) => {
    const player = ["焚影圣诀"];
    return (
        <Select
            size="sm"
            label="心法"
            disallowEmptySelection
            defaultSelectedKeys={[dataInput.player]}
            onSelectionChange={
                ((value: string) => {
                    updateInput((draft) => {
                        draft.player = value;
                    });
                }) as any
            }
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
    dataInput,
    updateInput,
    status,
}: {
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
    status: TypeStatus["data"];
}) => {
    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <Player dataInput={dataInput} updateInput={updateInput} />
            <div className="w-full grid grid-cols-2 gap-4 items-center">
                <IntegerInput
                    data={dataInput}
                    update={updateInput}
                    keys={["delayNetwork"]}
                    label="网络延迟"
                    max={status.userinput.maxDelayNetwork}
                />
                <IntegerInput
                    data={dataInput}
                    update={updateInput}
                    keys={["delayKeyboard"]}
                    label="按键延迟"
                    max={status.userinput.maxDelayKeyboard}
                />
                <IntegerInput
                    data={dataInput}
                    update={updateInput}
                    keys={["fightTime"]}
                    label="战斗时间"
                    max={status.userinput.maxFightTime}
                />
                <IntegerInput
                    data={dataInput}
                    update={updateInput}
                    keys={["fightCount"]}
                    label="计算次数"
                    max={status.userinput.maxFightCount}
                />
            </div>
            <p className="w-full text-gray-500 text-xs">* 战斗时间在使用严格循环时不生效.</p>
        </div>
    );
};
