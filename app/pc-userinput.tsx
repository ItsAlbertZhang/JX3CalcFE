// Page Component: UserInput
"use client";

import { Input, Select, SelectItem, CheckboxGroup, Checkbox } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { readText } from "@tauri-apps/api/clipboard";
import { useState } from "react";

function validateInteger(value: string) {
    if (value == "") {
        return true;
    }
    if (!/^[0-9]*$/.test(value)) {
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
    keys,
    label,
}: {
    state: any;
    setState: (value: any) => void;
    keys: string[];
    label: string;
}) => {
    return (
        <Input
            size="sm"
            label={label}
            value={
                keys.filter((key) => key in state).length > 0
                    ? Math.max(...keys.filter((key) => key in state).map((key) => state[key])).toString()
                    : "0"
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;
                if (validateInteger(newValue)) {
                    const newState = keys.reduce((obj, key) => ({ ...obj, [key]: Number(newValue) }), {});
                    setState({ ...state, ...newState });
                }
            }}
        />
    );
};

class Data {
    Vitality: number = 0;
    Strength: number = 0;
    Agility: number = 0;
    Spirit: number = 0;
    Spunk: number = 0;
    PhysicsAttackPowerBase: number = 0;
    SolarAttackPowerBase: number = 0;
    LunarAttackPowerBase: number = 0;
    NeutralAttackPowerBase: number = 0;
    PoisonAttackPowerBase: number = 0;
    PhysicsCriticalStrike: number = 0;
    SolarCriticalStrike: number = 0;
    LunarCriticalStrike: number = 0;
    NeutralCriticalStrike: number = 0;
    PoisonCriticalStrike: number = 0;
    PhysicsCriticalDamagePower: number = 0;
    SolarCriticalDamagePower: number = 0;
    LunarCriticalDamagePower: number = 0;
    NeutralCriticalDamagePower: number = 0;
    PoisonCriticalDamagePower: number = 0;
    PhysicsOvercomeBase: number = 0;
    SolarOvercomeBase: number = 0;
    LunarOvercomeBase: number = 0;
    NeutralOvercomeBase: number = 0;
    PoisonOvercomeBase: number = 0;
    SurplusValue: number = 0;
    Strain: number = 0;
    Haste: number = 0;
    MeleeWeaponDamage: number = 0; // 武器伤害基础值, 原数据中存在此字段
    MeleeWeaponDamageRand: number = 0; // 武器伤害随机值, 原数据中存在此字段
    MeleeWeaponDamageMax: number = 0; // 最高武器伤害, 原数据中并无此字段, 为便于输入设立
    // MeleeWeaponDamageMax 需要额外的处理计算 ( = MeleeWeaponDamage + MeleeWeaponDamageRand)
}

const PasteIcon = ({
    fill = "currentColor",
    filled,
    size,
    height,
    width,
    label,
    ...props
}: {
    fill?: string;
    filled?: boolean;
    size?: number;
    height?: number;
    width?: number;
    label?: string;
    [x: string]: any;
}) => {
    return (
        <svg
            width={size || width || 24}
            height={size || height || 24}
            viewBox="0 0 24 24"
            fill={filled ? fill : "none"}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M16 17.1c0 3.5-1.4 4.9-4.9 4.9H6.9C3.4 22 2 20.6 2 17.1v-4.2C2 9.4 3.4 8 6.9 8h4.2c3.5 0 4.9 1.4 4.9 4.9Z"
                stroke={fill}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 8V6.9C8 3.4 9.4 2 12.9 2h4.2C20.6 2 22 3.4 22 6.9v4.2c0 3.5-1.4 4.9-4.9 4.9H16"
                stroke={fill}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16 12.9C16 9.4 14.6 8 11.1 8"
                stroke={fill}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
        // path 抄自 nextui components import code
    );
};

const UIAttribute = ({ state, setState }: { state: iUserInput; setState: (value: iUserInput) => void }) => {
    const [data, setData] = useState<Data>(new Data());
    const [url, setUrl] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const cn = "flex justify-center items-center h-full w-full gap-4";
    function setDataAndState(value: Data) {
        // 额外处理武器伤害
        value.MeleeWeaponDamageRand = value.MeleeWeaponDamageMax - value.MeleeWeaponDamage;
        setData(value);
        setState({
            ...state,
            attribute: {
                method: "从数据导入",
                data: value,
            },
        });
    }
    async function importFromJX3BOX(input: string) {
        let url: string;
        // 验证输入
        if (input === "") {
            return;
        } else if (validateInteger(input)) {
            // 输入是配装 ID
            url = `http://cms.jx3box.com/api/cms/app/pz/${input}`;
        } else if (input.includes("/")) {
            // 输入可能是配装 URL
            const pzid = input.substring(input.lastIndexOf("/") + 1);
            if (validateInteger(pzid)) {
                url = `http://cms.jx3box.com/api/cms/app/pz/${pzid}`;
            } else {
                return;
            }
        } else {
            return;
        }
        // 请求数据
        try {
            const response = await fetch(url);
            const json = await response.json();
            if (json.code === 0) {
                // 额外处理武器伤害
                const data = json.data.data as Data;
                data.MeleeWeaponDamageMax = data.MeleeWeaponDamage + data.MeleeWeaponDamageRand;
                setDataAndState(data);
            }
        } catch (error) {
            console.error(error);
        }
    }
    async function pasteFromClipboard() {
        try {
            const text = await readText();
            if (text !== null) {
                setUrl(text);
                return text;
            }
        } catch (error) {
            console.error(error);
        }
        return "";
    }
    function importFromJX3BOXDirect(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        async function f() {
            const res = await pasteFromClipboard();
            await importFromJX3BOX(res);
        }
        f();
    }
    return (
        <>
            <div className={cn}>
                <UIInteger
                    state={data}
                    setState={setDataAndState}
                    keys={["Vitality", "Strength", "Agility", "Spirit", "Spunk"]}
                    label="基础属性"
                />
                <UIInteger
                    state={data}
                    setState={setDataAndState}
                    keys={[
                        "PhysicsAttackPowerBase",
                        "SolarAttackPowerBase",
                        "LunarAttackPowerBase",
                        "NeutralAttackPowerBase",
                        "PoisonAttackPowerBase",
                    ]}
                    label="基础攻击"
                />
            </div>
            <div className={cn}>
                <UIInteger
                    state={data}
                    setState={setDataAndState}
                    keys={[
                        "PhysicsCriticalStrike",
                        "SolarCriticalStrike",
                        "LunarCriticalStrike",
                        "NeutralCriticalStrike",
                        "PoisonCriticalStrike",
                    ]}
                    label="会心等级"
                />
                <UIInteger
                    state={data}
                    setState={setDataAndState}
                    keys={[
                        "PhysicsCriticalDamagePower",
                        "SolarCriticalDamagePower",
                        "LunarCriticalDamagePower",
                        "NeutralCriticalDamagePower",
                        "PoisonCriticalDamagePower",
                    ]}
                    label="会心效果等级"
                />
            </div>
            <div className={cn}>
                <UIInteger
                    state={data}
                    setState={setDataAndState}
                    keys={[
                        "PhysicsOvercomeBase",
                        "SolarOvercomeBase",
                        "LunarOvercomeBase",
                        "NeutralOvercomeBase",
                        "PoisonOvercomeBase",
                    ]}
                    label="基础破防等级"
                />
                <UIInteger state={data} setState={setDataAndState} keys={["Haste"]} label="急速等级" />
            </div>
            <div className={cn}>
                <UIInteger state={data} setState={setDataAndState} keys={["Strain"]} label="无双等级" />
                <UIInteger state={data} setState={setDataAndState} keys={["SurplusValue"]} label="破招" />
            </div>
            <div className={cn}>
                <UIInteger
                    state={data}
                    setState={setDataAndState}
                    keys={["MeleeWeaponDamage"]}
                    label="武器伤害(最低)"
                />
                <UIInteger
                    state={data}
                    setState={setDataAndState}
                    keys={["MeleeWeaponDamageMax"]}
                    label="武器伤害(最高)"
                />
            </div>
            <Button onPress={onOpen} onContextMenu={importFromJX3BOXDirect}>
                从 JX3BOX 导入数据
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm" placement="center" backdrop="blur">
                <ModalContent>
                    {(onClose) => {
                        async function importFromJX3BOXDialog() {
                            await importFromJX3BOX(url);
                            onClose();
                        }
                        return (
                            <>
                                <ModalHeader className="flex flex-col gap-1">从 JX3BOX 导入数据</ModalHeader>
                                <ModalBody>
                                    <p>Tips:</p>
                                    <p>复制配装 ID 或 URL 后, 在主界面右键点击按钮即可直接导入.</p>
                                    <Input
                                        size="sm"
                                        label="输入配装 ID 或 URL"
                                        value={url}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setUrl(event.target.value);
                                        }}
                                        endContent={
                                            <Button size="sm" isIconOnly variant="light" onClick={pasteFromClipboard}>
                                                <PasteIcon />
                                            </Button>
                                        }
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        取消
                                    </Button>
                                    <Button color="primary" onPress={importFromJX3BOXDialog}>
                                        导入
                                    </Button>
                                </ModalFooter>
                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </>
    );
};

const UIEffects = ({ state, setState }: { state: iUserInput; setState: (value: iUserInput) => void }) => {
    const effects = ["大附魔·腰", "大附魔·腕", "大附魔·鞋", "套装·技能", "套装·特效", "武器·水特效", "家园酒·加速"];
    return (
        <CheckboxGroup
            className="items-center"
            // label="增益选择"
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
                <UIInteger state={state} setState={setState} keys={["delayNetwork"]} label="网络延迟" />
                <UIInteger state={state} setState={setState} keys={["delayKeyboard"]} label="按键延迟" />
            </div>
            <div className={cn}>
                <UIInteger state={state} setState={setState} keys={["fightTime"]} label="战斗时间" />
                <UIInteger state={state} setState={setState} keys={["fightCount"]} label="战斗次数" />
            </div>
            <UIAttribute state={state} setState={setState} />
            <UIEffects state={state} setState={setState} />
        </>
    );
};
