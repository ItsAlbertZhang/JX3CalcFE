// Page Component: UserInput
"use client";

import { Input, Select, SelectItem, CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState } from "react";

function validateNumber(value: string) {
    if (value == "") {
        return true;
    }
    if (!/^[1-9][0-9]*$/.test(value)) {
        return false;
    }
    return true;
}

export function UserInput({ state, setState }: { state: object; setState: (value: any) => void }) {
    const player = ["焚影圣诀"];
    const [delayNetwork, setDelayNetwork] = useState("");
    const [delayKeyboard, setdelayKeyboard] = useState("");
    const [fightTime, setFightTime] = useState("");
    const [fightCount, setFightCount] = useState("");
    const attribute = ["从JX3BOX导入"];
    const [attributeIdx, setAttributeIdx] = useState(-1);
    const [attributeObj, setAttributeObj] = useState({});
    const effects = ["大附魔·腰", "大附魔·腕", "大附魔·鞋", "套装·技能", "套装·特效"];

    const jsxPlayer = (
        <Select
            size="sm"
            label="心法"
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
    const jsxDelay = (
        <div className={"flex justify-center items-center h-full w-full gap-4"}>
            <Input
                size="sm"
                label="网络延迟"
                value={delayNetwork}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = event.target.value;
                    if (validateNumber(newValue)) {
                        setDelayNetwork(newValue);
                        setState({ ...state, delayNetwork: Number(newValue) });
                    }
                }}
            />
            <Input
                size="sm"
                label="按键延迟"
                value={delayKeyboard}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = event.target.value;
                    if (validateNumber(newValue)) {
                        setdelayKeyboard(newValue);
                        setState({ ...state, delayKeyboard: Number(newValue) });
                    }
                }}
            />
        </div>
    );
    const jsxFight = (
        <div className={"flex justify-center items-center h-full w-full gap-4"}>
            <Input
                size="sm"
                label="战斗时间"
                value={fightTime}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = event.target.value;
                    if (validateNumber(newValue)) {
                        setFightTime(newValue);
                        setState({ ...state, fightTime: Number(newValue) });
                    }
                }}
            />
            <Input
                size="sm"
                label="战斗次数"
                value={fightCount}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = event.target.value;
                    if (validateNumber(newValue)) {
                        setFightCount(newValue);
                        setState({ ...state, fightCount: Number(newValue) });
                    }
                }}
            />
        </div>
    );
    const jsxAttributeType = (
        <Select
            size="sm"
            label="属性输入方案"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setAttributeIdx(attribute.indexOf(e.target.value));
                setAttributeObj({ method: e.target.value });
            }}
        >
            {attribute.map((item, idx) => (
                <SelectItem key={item} value={item}>
                    {item}
                </SelectItem>
            ))}
        </Select>
    );
    let jsxAttributeData = <></>;
    switch (attributeIdx) {
        case 0:
            jsxAttributeData = (
                <Input
                    size="sm"
                    label="输入配装ID"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const data = {
                            pzid: event.target.value,
                        };
                        const obj = { ...attributeObj, data: data };
                        setState({ ...state, attribute: obj });
                    }}
                />
            );
    }
    const jsxEffects = (
        <CheckboxGroup
            className="items-center"
            label="增益选择"
            onValueChange={(values: string[]) => {
                setState({ ...state, effects: values });
            }}
        >
            {effects.map((str) => {
                return (
                    <Checkbox key={str} value={str}>
                        {str}
                    </Checkbox>
                );
            })}
        </CheckboxGroup>
    );

    return (
        <>
            {jsxPlayer}
            {jsxDelay}
            {jsxFight}
            {jsxAttributeType}
            {jsxAttributeData}
            {jsxEffects}
        </>
    );
}
