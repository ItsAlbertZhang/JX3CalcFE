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
    Tooltip,
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

const AttrModalContent = ({
    updateInputs,
    index,
}: {
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    index: number;
}) => {
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
                        updateInputs((draft) => {
                            draft[index].attribute.data = res;
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
                            <p>注意: 配装需要公开, 否则计算器无法访问.</p>
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
    dataInputs,
    updateInputs,
    page,
    setPage,
}: {
    dataInputs: DataInput[];
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    page: number;
    setPage: (page: number) => void;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const index = page - 1;

    function importFromJX3BOXDirect(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        async function f() {
            const str = await readClipboard();
            const data = await importFromJX3BOX(str);
            if (data !== undefined) {
                updateInputs((draft) => {
                    draft[index].attribute.data = data;
                });
            }
        }
        f();
    }

    function createAttributeBenefitPage() {
        updateInputs((draft) => {
            const newDraft: DataInput[] = [{ ...draft[index], name: "基准页" }];
            const ADD_BASE = 198;
            const ADD_MAGIC_ATTACK = 475;
            const ADD_CRITICAL = 883;
            const ADD_CRITICAL_DAMAGE = 883;
            const ADD_OVERCOME = 883;
            const ADD_STRAIN = 883;
            const ADD_SURPLUS = 883;
            const ATTRS = ["基础", "攻击", "会心", "会效", "破防", "无双", "破招"];
            for (let i = 0; i < ATTRS.length; i++) {
                newDraft.push(JSON.parse(JSON.stringify(newDraft[0])));
                newDraft[i + 1].name = ATTRS[i];
            }
            newDraft[1].attribute.data.Strength += ADD_BASE;
            newDraft[1].attribute.data.Agility += ADD_BASE;
            newDraft[1].attribute.data.Spirit += ADD_BASE;
            newDraft[1].attribute.data.Spunk += ADD_BASE;
            newDraft[2].attribute.data.SolarAttackPowerBase += ADD_MAGIC_ATTACK;
            newDraft[2].attribute.data.LunarAttackPowerBase += ADD_MAGIC_ATTACK;
            newDraft[2].attribute.data.NeutralAttackPowerBase += ADD_MAGIC_ATTACK;
            newDraft[2].attribute.data.PoisonAttackPowerBase += ADD_MAGIC_ATTACK;
            newDraft[3].attribute.data.PhysicsCriticalStrike += ADD_CRITICAL;
            newDraft[3].attribute.data.SolarCriticalStrike += ADD_CRITICAL;
            newDraft[3].attribute.data.LunarCriticalStrike += ADD_CRITICAL;
            newDraft[3].attribute.data.NeutralCriticalStrike += ADD_CRITICAL;
            newDraft[3].attribute.data.PoisonCriticalStrike += ADD_CRITICAL;
            newDraft[4].attribute.data.PhysicsCriticalDamagePower += ADD_CRITICAL_DAMAGE;
            newDraft[4].attribute.data.SolarCriticalDamagePower += ADD_CRITICAL_DAMAGE;
            newDraft[4].attribute.data.LunarCriticalDamagePower += ADD_CRITICAL_DAMAGE;
            newDraft[4].attribute.data.NeutralCriticalDamagePower += ADD_CRITICAL_DAMAGE;
            newDraft[4].attribute.data.PoisonCriticalDamagePower += ADD_CRITICAL_DAMAGE;
            newDraft[5].attribute.data.PhysicsOvercomeBase += ADD_OVERCOME;
            newDraft[5].attribute.data.SolarOvercomeBase += ADD_OVERCOME;
            newDraft[5].attribute.data.LunarOvercomeBase += ADD_OVERCOME;
            newDraft[5].attribute.data.NeutralOvercomeBase += ADD_OVERCOME;
            newDraft[5].attribute.data.PoisonOvercomeBase += ADD_OVERCOME;
            newDraft[6].attribute.data.Strain += ADD_STRAIN;
            newDraft[7].attribute.data.SurplusValue += ADD_SURPLUS;
            return newDraft;
        });
        setPage(1);
    }

    function updateAttribute(fn: (draft: DataAttribute) => void) {
        updateInputs((draft) => {
            fn(draft[index].attribute.data);
        });
    }

    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <div className="w-full grid grid-cols-2 gap-4 items-center sm:grid-cols-3">
                <Tooltip showArrow delay={250} closeDelay={250} content="从 JX3BOX 导入数据">
                    <Button onPress={onOpen} onContextMenu={importFromJX3BOXDirect}>
                        导入
                    </Button>
                </Tooltip>
                <Tooltip
                    showArrow
                    delay={250}
                    closeDelay={250}
                    content={
                        <>
                            <p>以当前页为基准创建属性加成页.</p>
                            <p className="text-red-500">注意: 所有的其他页面会被删除!</p>
                        </>
                    }
                >
                    <Button onPress={createAttributeBenefitPage}>属性收益</Button>
                </Tooltip>
                <IntegerInput
                    data={dataInputs[index].attribute.data}
                    update={updateAttribute}
                    keys={["Strength", "Agility", "Spirit", "Spunk"]}
                    label="心法属性"
                />
                <IntegerInput
                    data={dataInputs[index].attribute.data}
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
                    data={dataInputs[index].attribute.data}
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
                    data={dataInputs[index].attribute.data}
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
                    data={dataInputs[index].attribute.data}
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
                    data={dataInputs[index].attribute.data}
                    update={updateAttribute}
                    keys={["Haste"]}
                    label="急速等级"
                />
                <IntegerInput
                    data={dataInputs[index].attribute.data}
                    update={updateAttribute}
                    keys={["Strain"]}
                    label="无双等级"
                />
                <IntegerInput
                    data={dataInputs[index].attribute.data}
                    update={updateAttribute}
                    keys={["SurplusValue"]}
                    label="破招"
                />
                <IntegerInput
                    data={dataInputs[index].attribute.data}
                    update={updateAttribute}
                    keys={["MeleeWeaponDamage"]}
                    label="武器伤害(最低)"
                />
                <IntegerInput
                    data={dataInputs[index].attribute.data}
                    update={updateAttribute}
                    keys={["MeleeWeaponDamageMax"]}
                    label="武器伤害(最高)"
                />
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm" placement="center" backdrop="blur">
                <AttrModalContent updateInputs={updateInputs} index={index} />
            </Modal>
        </div>
    );
};
