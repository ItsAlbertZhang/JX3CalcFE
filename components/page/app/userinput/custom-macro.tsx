"use client";
// my libraries
import { readLua } from "@/components/actions";
import { ContextBRStatus, ContextUserinput } from "@/components/context";
import { ibrStatus } from "@/components/definitions";
// third party libraries
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Select,
    SelectItem,
    Spacer,
    useDisclosure,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";

const WarningContent = ({
    setWarned,
    setMethod,
    selectLuaFile,
}: {
    setWarned: (value: boolean) => void;
    setMethod: (value: string) => void;
    selectLuaFile: () => void;
}) => {
    const res = (
        <ModalContent>
            {(onClose) => {
                function handleAgree() {
                    setWarned(true);
                    onClose();
                    selectLuaFile();
                }
                function handleRefuse() {
                    setMethod("使用内置循环");
                    onClose();
                }
                return (
                    <>
                        <ModalHeader>警告</ModalHeader>
                        <ModalBody className="mb-4">
                            <p>你正在尝试开启自定义技能循环.</p>
                            <p>
                                自定义技能循环功能仍不完善, 目前仅支持使用 lua 编写规则.
                                更便捷的对游戏内原生宏的支持仍在开发中.
                            </p>
                            <p>注意: 自定义技能循环会执行你提供的代码. 如果这段代码存在问题, 程序可能崩溃.</p>
                            <p className="text-[#FF0000]">如果这是一段恶意代码, 程序可能产生不可预知的后果!</p>
                            <p>请确保你对使用的代码有足够的了解.</p>
                            <Button color="danger" onPress={handleAgree}>
                                我已知晓使用自定义技能循环的风险, 继续使用
                            </Button>
                            <Button onPress={handleRefuse}>退出</Button>
                        </ModalBody>
                    </>
                );
            }}
        </ModalContent>
    );
    return res;
};

export const Custom = () => {
    const [hide, setHide] = useState(true);
    const status = (useContext(ContextBRStatus) as ibrStatus["data"]).userinput;
    const warning = useDisclosure();
    const [warned, setWarned] = useState(false);
    const methods = ["使用内置循环", "使用lua脚本"];
    const [method, setMethod] = useState(methods[0]);
    const { value, setValue } = useContext(ContextUserinput);

    useEffect(() => {
        if (status.allowCustom) {
            setHide(false);
        }
    }, [status.allowCustom]);

    if (hide) {
        return <></>;
    }

    async function selectLuaFile() {
        const file = await readLua();
        if (file) {
            const newValue = {
                ...value,
                custom: {
                    method: "使用lua脚本",
                    data: file,
                },
            };
            setValue(newValue);
        }
    }

    let cnAdd = "";
    let input: JSX.Element;

    switch (method) {
        case methods[1]:
            input = (
                <Button onClick={selectLuaFile}>
                    <Spacer x={2} />
                    选择lua文件
                    <Spacer x={2} />
                </Button>
            );
            break;
        default:
            input = <></>;
            break;
    }

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setMethod(e.target.value);
        switch (e.target.value) {
            case methods[0]:
                let newValue = { ...value };
                delete newValue.custom;
                setValue(newValue);
                break;
            case methods[1]:
                if (!warned) {
                    warning.onOpen();
                }
                break;
        }
    }

    return (
        <div className={"w-full flex justify-center items-center gap-10" + cnAdd}>
            <Select label="技能循环" defaultSelectedKeys={[methods[0]]} selectedKeys={[method]} onChange={handleChange}>
                {methods.map((item) => (
                    <SelectItem key={item} value={item}>
                        {item}
                    </SelectItem>
                ))}
            </Select>
            {input}
            <Modal isOpen={warning.isOpen} onOpenChange={warning.onOpenChange} placement="center" backdrop="blur">
                <WarningContent setWarned={setWarned} setMethod={setMethod} selectLuaFile={selectLuaFile} />
            </Modal>
        </div>
    );
};
