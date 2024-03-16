"use client";
// my libraries
import { openUrl, readLua } from "@/components/actions";
import { ContextBRStatus, ContextUserinput } from "@/components/context";
import { ibrStatus } from "@/components/definitions";
// third party libraries
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select,
    SelectItem,
    Spacer,
    Textarea,
    useDisclosure,
} from "@nextui-org/react";
import { IoAddCircle } from "react-icons/io5";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";

const methods = ["使用内置循环", "使用lua编程语言", "使用游戏内宏"];
const help = "http://jx3calc.com/help/custom";

const ModalContentWarning = ({
    setMethod,
    setWarned,
    selectLuaFile,
}: {
    setMethod: (value: string) => void;
    setWarned: (value: boolean) => void;
    selectLuaFile: () => void;
}) => {
    return (
        <ModalContent>
            {(onClose) => {
                function handleAgree() {
                    setWarned(true);
                    onClose();
                    selectLuaFile();
                }
                function handleHelp() {
                    openUrl(help);
                }
                function handleRefuse() {
                    setMethod("使用内置循环");
                    onClose();
                }
                const body = (
                    <ModalBody className="mb-4">
                        <p>你正在尝试使用lua编程语言自定义技能循环.</p>
                        <p>程序会执行你提供的代码. 如果这段代码存在问题, 程序可能崩溃.</p>
                        <p className="text-[#FF0000]">如果这是一段恶意代码, 程序可能产生不可预知的后果!</p>
                        <p>请确保你对使用的代码有足够的了解.</p>
                        <Button color="danger" onPress={handleAgree} className="min-h-unit-xl">
                            我已知晓使用自定义技能循环的风险, 继续使用
                        </Button>
                        <Button color="primary" onPress={handleHelp} className="min-h-unit-xl">
                            查看使用帮助
                        </Button>
                        <Button onPress={handleRefuse} className="min-h-unit-xl">
                            退出
                        </Button>
                    </ModalBody>
                );
                return (
                    <>
                        <ModalHeader>警告</ModalHeader>
                        {body}
                    </>
                );
            }}
        </ModalContent>
    );
};

const ModalContentInput = ({ submitCustom }: { submitCustom: (macros: string[]) => void }) => {
    const [count, setCount] = useState(1);
    const [input, setInput] = useState([""]);
    return (
        <ModalContent>
            {(onClose) => {
                function handleSubmit() {
                    submitCustom(input);
                    onClose();
                }
                function handleCancel() {
                    onClose();
                }
                function handleHelp() {
                    openUrl(help);
                }
                function handleAdd() {
                    setCount(count + 1);
                }

                const bodyInput = [];
                for (let i = 0; i < count; i++) {
                    bodyInput.push(
                        <Textarea
                            key={i}
                            value={input[i]}
                            label={`宏${i}`}
                            onChange={(e) => {
                                let newInput = [...input];
                                newInput[i] = e.target.value;
                                setInput(newInput);
                            }}
                        />
                    );
                }
                const bodyAdd = (
                    <Button onPress={handleAdd} size="lg" variant="light" className="min-h-unit-2xl">
                        <IoAddCircle />
                    </Button>
                );
                const body = (
                    <ModalBody className="mb-4">
                        {bodyInput}
                        {bodyAdd}
                    </ModalBody>
                );
                const footer = (
                    <ModalFooter>
                        <div className="w-full min-h-unit-xl flex justify-center items-center gap-2">
                            <Button onPress={handleHelp} color="primary">
                                帮助
                            </Button>
                            <div className="grow"></div>
                            <Button onPress={handleCancel} color="danger" variant="light">
                                取消
                            </Button>
                            <Button onPress={handleSubmit}>提交</Button>
                        </div>
                    </ModalFooter>
                );
                return (
                    <>
                        <ModalHeader>输入游戏内宏</ModalHeader>
                        {body}
                        {footer}
                    </>
                );
            }}
        </ModalContent>
    );
};

export const Custom = () => {
    const [hide, setHide] = useState(true); // 整体部件是否隐藏
    const [method, setMethod] = useState(methods[0]); // 选用的方法
    const [warned, setWarned] = useState(false); // 是否已经警告过
    const [valid, setValid] = useState(false); // 是否已经选择了lua文件或输入了宏

    const status = (useContext(ContextBRStatus) as ibrStatus["data"]).userinput;
    const { value, setValue } = useContext(ContextUserinput);
    const modal = useDisclosure();

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
                    method: "使用lua编程语言",
                    data: file,
                },
            };
            setValue(newValue);
            setValid(true);
        }
    }
    async function submitCustom(macros: string[]) {
        const data = macros.filter((item) => item !== ""); // 过滤空宏
        if (data.length > 0) {
            const newValue = {
                ...value,
                custom: {
                    method: "使用游戏内宏",
                    data: data,
                },
            };
            setValue(newValue);
            setValid(true);
        } else {
            // 重置 value
            const newValue = { ...value };
            delete newValue.custom;
            setValue(newValue);
            // 重置 valid
            setValid(false);
        }
    }

    let input = <></>;
    let content = (
        <ModalContent>
            <></>
        </ModalContent>
    );

    // 渲染
    switch (method) {
        case methods[1]:
            input = (
                <Button
                    onPress={selectLuaFile}
                    color={valid ? "success" : "danger"}
                    startContent={valid ? <FaCircleCheck /> : <FaCircleXmark />}
                    className=" min-w-min"
                >
                    选择lua文件
                </Button>
            );
            content = <ModalContentWarning setWarned={setWarned} setMethod={setMethod} selectLuaFile={selectLuaFile} />;
            break;
        case methods[2]:
            input = (
                <Button
                    onPress={modal.onOpen}
                    color={valid ? "success" : "danger"}
                    startContent={valid ? <FaCircleCheck /> : <FaCircleXmark />}
                    className=" min-w-min"
                >
                    重新输入
                </Button>
            );
            content = <ModalContentInput submitCustom={submitCustom} />;
            break;
        default:
            input = <></>;
            content = <></>;
            break;
    }

    // 选择事件
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setMethod(e.target.value);
        // 重置 value
        const newValue = { ...value };
        delete newValue.custom;
        setValue(newValue);
        // 重置 valid
        setValid(false);
        switch (e.target.value) {
            case methods[1]:
                if (!warned) {
                    modal.onOpen();
                } else {
                    selectLuaFile();
                }
                break;
            case methods[2]:
                modal.onOpen();
                break;
        }
    }

    return (
        <div className="w-full flex justify-center items-center gap-8">
            <Select label="技能循环" defaultSelectedKeys={[methods[0]]} selectedKeys={[method]} onChange={handleChange}>
                {methods.map((item) => (
                    <SelectItem key={item} value={item}>
                        {item}
                    </SelectItem>
                ))}
            </Select>
            {input}
            <Modal
                isOpen={modal.isOpen}
                onOpenChange={modal.onOpenChange}
                placement="center"
                backdrop="blur"
                scrollBehavior="inside"
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                hideCloseButton={true}
            >
                {content}
            </Modal>
        </div>
    );
};
