"use client";
// my libraries
import { openUrl } from "@/components/actions";

// third party libraries
import { Button, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea } from "@nextui-org/react";
import { IoAddCircle } from "react-icons/io5";
import { useState } from "react";

const help = "http://jx3calc.com/help/custom";

export const ModalLua = ({ selectLuaFile }: { selectLuaFile: () => void }) => {
    return (
        <ModalContent>
            {(onClose) => {
                function handleAgree() {
                    onClose();
                    selectLuaFile();
                }
                function handleHelp() {
                    openUrl(help);
                }
                function handleRefuse() {
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
                        {<ModalHeader>警告</ModalHeader>}
                        {body}
                    </>
                );
            }}
        </ModalContent>
    );
};

export const ModalMacro = ({ submitCustom }: { submitCustom: (macros: string[]) => void }) => {
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
