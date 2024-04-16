// Page Component: Userinput: Attribute
"use client";
// child components simple
import { validateInteger, IntegerInput } from "./Common";
// my libraries
import { fetchGetJson, readClipboard } from "@/components/actions";
import { DataAttribute, DataInput } from "@/components/definitions";

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
import { FaRegPaste } from "react-icons/fa6";

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
        const data = body.data.data as DataAttribute;
        data.MeleeWeaponDamageMax = data.MeleeWeaponDamage + data.MeleeWeaponDamageRand;
        return data;
    }
}

const AttrModalContent = ({ updateInput }: { updateInput: (fn: (draft: DataInput) => void) => void }) => {
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
                        updateInput((draft) => {
                            draft.attribute.data = res;
                        });
                        onClose();
                    }
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
                                        <FaRegPaste size={20} />
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

export const Attribute = ({
    dataInput,
    updateInput,
}: {
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function importFromJX3BOXDirect(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        async function f() {
            const str = await readClipboard();
            const data = await importFromJX3BOX(str);
            if (data !== undefined) {
                updateInput((draft) => {
                    draft.attribute.data = data;
                });
            }
        }
        f();
    }

    function updateAttribute(fn: (draft: DataAttribute) => void) {
        updateInput((draft) => {
            fn(draft.attribute.data);
        });
    }

    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <div className="w-full grid grid-cols-2 gap-4 items-center sm:grid-cols-3">
                <Button onPress={onOpen} onContextMenu={importFromJX3BOXDirect} className="col-span-2">
                    从 JX3BOX 导入数据
                </Button>
                <IntegerInput
                    data={dataInput.attribute.data}
                    update={updateAttribute}
                    keys={["Strength", "Agility", "Spirit", "Spunk"]}
                    label="心法属性"
                />
                <IntegerInput
                    data={dataInput.attribute.data}
                    update={updateAttribute}
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
                    data={dataInput.attribute.data}
                    update={updateAttribute}
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
                    data={dataInput.attribute.data}
                    update={updateAttribute}
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
                    data={dataInput.attribute.data}
                    update={updateAttribute}
                    keys={[
                        "PhysicsOvercomeBase",
                        "SolarOvercomeBase",
                        "LunarOvercomeBase",
                        "NeutralOvercomeBase",
                        "PoisonOvercomeBase",
                    ]}
                    label="基础破防等级"
                />
                <IntegerInput
                    data={dataInput.attribute.data}
                    update={updateAttribute}
                    keys={["Haste"]}
                    label="急速等级"
                />
                <IntegerInput
                    data={dataInput.attribute.data}
                    update={updateAttribute}
                    keys={["Strain"]}
                    label="无双等级"
                />
                <IntegerInput
                    data={dataInput.attribute.data}
                    update={updateAttribute}
                    keys={["SurplusValue"]}
                    label="破招"
                />
                <IntegerInput
                    data={dataInput.attribute.data}
                    update={updateAttribute}
                    keys={["MeleeWeaponDamage"]}
                    label="武器伤害(最低)"
                />
                <IntegerInput
                    data={dataInput.attribute.data}
                    update={updateAttribute}
                    keys={["MeleeWeaponDamageMax"]}
                    label="武器伤害(最高)"
                />
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm" placement="center" backdrop="blur">
                <AttrModalContent updateInput={updateInput} />
            </Modal>
        </div>
    );
};
