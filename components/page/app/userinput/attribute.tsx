// Page Component: Userinput: Attribute
"use client";
// child components simple
import { validateInteger, IntegerInput } from "./base";
// my libraries
import { fetchGetJson, readClipboard } from "@/components/actions";
import { ContextUserinput } from "@/components/context";
import { ClsUserinputAttrData } from "@/components/definitions";

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
import { useContext, useState } from "react";

const AttrInputArea = ({
    data,
    setDataAndContext,
    onOpen,
}: {
    data: ClsUserinputAttrData;
    setDataAndContext: (value: ClsUserinputAttrData) => void;
    onOpen: () => void;
}) => {
    function importFromJX3BOXDirect(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        async function f() {
            const str = await readClipboard();
            const data = await importFromJX3BOX(str);
            if (data !== undefined) {
                setDataAndContext(data);
            }
        }
        f();
    }
    return (
        <>
            <div className="w-full grid grid-cols-2 gap-4 items-center sm:grid-cols-3">
                <Button onPress={onOpen} onContextMenu={importFromJX3BOXDirect} className="col-span-2">
                    从 JX3BOX 导入数据
                </Button>
                <IntegerInput
                    state={data}
                    setState={setDataAndContext}
                    keys={["Strength", "Agility", "Spirit", "Spunk"]}
                    label="心法属性"
                />
                <IntegerInput
                    state={data}
                    setState={setDataAndContext}
                    keys={[
                        "PhysicsAttackPowerBase",
                        "SolarAttackPowerBase",
                        "LunarAttackPowerBase",
                        "NeutralAttackPowerBase",
                        "PoisonAttackPowerBase",
                    ]}
                    label="基础攻击"
                />
                <IntegerInput
                    state={data}
                    setState={setDataAndContext}
                    keys={[
                        "PhysicsCriticalStrike",
                        "SolarCriticalStrike",
                        "LunarCriticalStrike",
                        "NeutralCriticalStrike",
                        "PoisonCriticalStrike",
                    ]}
                    label="会心等级"
                />
                <IntegerInput
                    state={data}
                    setState={setDataAndContext}
                    keys={[
                        "PhysicsCriticalDamagePower",
                        "SolarCriticalDamagePower",
                        "LunarCriticalDamagePower",
                        "NeutralCriticalDamagePower",
                        "PoisonCriticalDamagePower",
                    ]}
                    label="会心效果等级"
                />
                <IntegerInput
                    state={data}
                    setState={setDataAndContext}
                    keys={[
                        "PhysicsOvercomeBase",
                        "SolarOvercomeBase",
                        "LunarOvercomeBase",
                        "NeutralOvercomeBase",
                        "PoisonOvercomeBase",
                    ]}
                    label="基础破防等级"
                />
                <IntegerInput state={data} setState={setDataAndContext} keys={["Haste"]} label="急速等级" />
                <IntegerInput state={data} setState={setDataAndContext} keys={["Strain"]} label="无双等级" />
                <IntegerInput state={data} setState={setDataAndContext} keys={["SurplusValue"]} label="破招" />
                <IntegerInput
                    state={data}
                    setState={setDataAndContext}
                    keys={["MeleeWeaponDamage"]}
                    label="武器伤害(最低)"
                />
                <IntegerInput
                    state={data}
                    setState={setDataAndContext}
                    keys={["MeleeWeaponDamageMax"]}
                    label="武器伤害(最高)"
                />
            </div>
        </>
    );
};

const IconPaste = () => {
    return (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16 17.1c0 3.5-1.4 4.9-4.9 4.9H6.9C3.4 22 2 20.6 2 17.1v-4.2C2 9.4 3.4 8 6.9 8h4.2c3.5 0 4.9 1.4 4.9 4.9Z"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 8V6.9C8 3.4 9.4 2 12.9 2h4.2C20.6 2 22 3.4 22 6.9v4.2c0 3.5-1.4 4.9-4.9 4.9H16"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16 12.9C16 9.4 14.6 8 11.1 8"
                stroke="currentColor"
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
    let path: string;
    // 验证输入
    if (input === "") {
        return;
    } else if (validateInteger(input)) {
        // 输入是配装 ID
        path = `/api/cms/app/pz/${input}`;
    } else if (input.includes("/")) {
        // 输入可能是配装 URL
        const pzid = input.substring(input.lastIndexOf("/") + 1);
        if (validateInteger(pzid)) {
            path = `/api/cms/app/pz/${pzid}`;
        } else {
            return;
        }
    } else {
        return;
    }
    // 请求数据
    let body = await fetchGetJson({ host: "cms.jx3box.com", path });
    if (body !== undefined && body.code === 0) {
        // 额外处理武器伤害
        const data = body.data.data as ClsUserinputAttrData;
        data.MeleeWeaponDamageMax = data.MeleeWeaponDamage + data.MeleeWeaponDamageRand;
        return data;
    }
}

const AttrModalContent = ({ setDataAndContext }: { setDataAndContext: (value: ClsUserinputAttrData) => void }) => {
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
                        setDataAndContext(res);
                    }
                    onClose();
                }
                return (
                    <>
                        <ModalHeader>从 JX3BOX 导入数据</ModalHeader>
                        <ModalBody>
                            <p>Tips:</p>
                            <p>复制配装 ID 或 URL 后, 在主界面右键点击按钮即可无需打开此对话框直接导入.</p>
                            <Input
                                autoFocus
                                size="sm"
                                label="输入配装 ID 或 URL"
                                value={url}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setUrl(event.target.value);
                                }}
                                endContent={
                                    <Button size="sm" isIconOnly variant="light" onPress={paste}>
                                        <IconPaste />
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

export const Attribute = () => {
    const [data, setData] = useState<ClsUserinputAttrData>(new ClsUserinputAttrData());
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { value, setValue } = useContext(ContextUserinput);

    function setDataAndContext(data: ClsUserinputAttrData) {
        // 额外处理武器伤害
        data.MeleeWeaponDamageRand = data.MeleeWeaponDamageMax - data.MeleeWeaponDamage;
        setData(data);
        setValue({
            ...value,
            attribute: {
                method: "从数据导入",
                data: data,
            },
        });
    }

    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <AttrInputArea data={data} setDataAndContext={setDataAndContext} onOpen={onOpen} />
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm" placement="center" backdrop="blur">
                <AttrModalContent setDataAndContext={setDataAndContext} />
            </Modal>
        </div>
    );
};
