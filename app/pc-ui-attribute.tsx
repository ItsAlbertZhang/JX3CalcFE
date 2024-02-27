// Page Component: UserInput: Attribute
"use client";

import { fetchJson, readClipboard } from "./actions";
import { ClsUserInputAttrData, ClsUserInput } from "./definitions";
import { validateInteger, UIInteger } from "./pc-userinput-base";
import {
    Button,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

const UIAttrInput = ({
    data,
    setDataAndState,
}: {
    data: ClsUserInputAttrData;
    setDataAndState: (value: ClsUserInputAttrData) => void;
}) => {
    const cn = "flex justify-center items-center h-full w-full gap-4";
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
        </>
    );
};

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
        // path 来自 nextui components import code
    );
};

async function importFromJX3BOX(input: string) {
    input = input.trimEnd(); // 去除末尾空格, 换行符等
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
    let body = await fetchJson(url);
    if (body !== undefined && body.code === 0) {
        // 额外处理武器伤害
        const data = body.data.data as ClsUserInputAttrData;
        data.MeleeWeaponDamageMax = data.MeleeWeaponDamage + data.MeleeWeaponDamageRand;
        return data;
    }
}

const UIAttrModalContent = ({ setDataAndState }: { setDataAndState: (value: ClsUserInputAttrData) => void }) => {
    const [url, setUrl] = useState("");
    return (
        <ModalContent>
            {(onClose) => {
                async function paste() {
                    const res = await readClipboard();
                    setUrl(res);
                }
                async function importFromJX3BOXAction() {
                    const res = await importFromJX3BOX(url);
                    if (res !== undefined) {
                        setDataAndState(res);
                    }
                    onClose();
                }
                return (
                    <>
                        <ModalHeader className="flex flex-col gap-1">从 JX3BOX 导入数据</ModalHeader>
                        <ModalBody>
                            <p>Tips:</p>
                            <p>复制配装 ID 或 URL 后, 在主界面右键点击按钮即可无需打开此对话框直接导入.</p>
                            <Input
                                size="sm"
                                label="输入配装 ID 或 URL"
                                value={url}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setUrl(event.target.value);
                                }}
                                endContent={
                                    <Button size="sm" isIconOnly variant="light" onClick={paste}>
                                        <PasteIcon />
                                    </Button>
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                取消
                            </Button>
                            <Button color="primary" onPress={importFromJX3BOXAction}>
                                导入
                            </Button>
                        </ModalFooter>
                    </>
                );
            }}
        </ModalContent>
    );
};

export const UIAttribute = ({ state, setState }: { state: ClsUserInput; setState: (value: ClsUserInput) => void }) => {
    const [data, setData] = useState<ClsUserInputAttrData>(new ClsUserInputAttrData());
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function setDataAndState(value: ClsUserInputAttrData) {
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

    function importFromJX3BOXDirect(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        async function f() {
            const str = await readClipboard();
            const data = await importFromJX3BOX(str);
            if (data !== undefined) {
                setDataAndState(data);
            }
        }
        f();
    }
    return (
        <>
            <UIAttrInput data={data} setDataAndState={setDataAndState} />
            <Button onPress={onOpen} onContextMenu={importFromJX3BOXDirect}>
                从 JX3BOX 导入数据
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm" placement="center" backdrop="blur">
                <UIAttrModalContent setDataAndState={setDataAndState} />
            </Modal>
        </>
    );
};
