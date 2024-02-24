// Page Component: UserInput
"use client";

import { Input, Select, SelectItem, CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState } from "react";

function validateInteger(value: string) {
    if (value == "") {
        return true;
    }
    if (!/^[1-9][0-9]*$/.test(value)) {
        return false;
    }
    return true;
}

export interface iUserInput {
    player: string;
    delayNetwork: number;
    delayKeyboard: number;
    fightTime: number;
    fightCount: number;
    attribute: object;
    effects: string[];
}

const UIPlayer = ({ state, setState }: { state: iUserInput; setState: (value: iUserInput) => void }) => {
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

const UIInteger = ({
    state,
    setState,
    keyname,
    label,
}: {
    state: iUserInput;
    setState: (value: iUserInput) => void;
    keyname: keyof iUserInput;
    label: string;
}) => {
    const [value, setValue] = useState(state[keyname].toString());
    return (
        <Input
            size="sm"
            label={label}
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;
                if (validateInteger(newValue)) {
                    setValue(newValue);
                    setState({ ...state, [keyname]: Number(newValue) });
                }
            }}
        />
    );
};

// 暂时如此处理. 之后会重写属性输入方案.
const UIAttribute = ({ state, setState }: { state: iUserInput; setState: (value: iUserInput) => void }) => {
    const attribute = ["从JX3BOX导入"];
    const [attributeIdx, setAttributeIdx] = useState(-1);
    const [attributeObj, setAttributeObj] = useState({});
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
    return (
        <>
            {jsxAttributeType}
            {jsxAttributeData}
        </>
    );
};

const UIEffects = ({ state, setState }: { state: iUserInput; setState: (value: iUserInput) => void }) => {
    const effects = ["大附魔·腰", "大附魔·腕", "大附魔·鞋", "套装·技能", "套装·特效"];
    return (
        <CheckboxGroup
            className="items-center"
            label="增益选择"
            value={state.effects}
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
};

export const UserInput = ({ state, setState }: { state: iUserInput; setState: (value: iUserInput) => void }) => {
    const cn = "flex justify-center items-center h-full w-full gap-4";
    return (
        <>
            <UIPlayer state={state} setState={setState} />
            <div className={cn}>
                <UIInteger state={state} setState={setState} keyname="delayNetwork" label="网络延迟" />
                <UIInteger state={state} setState={setState} keyname="delayKeyboard" label="按键延迟" />
            </div>
            <div className={cn}>
                <UIInteger state={state} setState={setState} keyname="fightTime" label="战斗时间" />
                <UIInteger state={state} setState={setState} keyname="fightCount" label="战斗次数" />
            </div>
            <UIAttribute state={state} setState={setState} />
            <UIEffects state={state} setState={setState} />
        </>
    );
};
