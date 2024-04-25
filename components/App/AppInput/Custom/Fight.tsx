"use client";
// child components
import { ModalLua, ModalMacro } from "./FightModals";

// my libraries
import { readLua } from "@/components/actions";
import { DataInput, TypeStatus } from "@/components/definitions";

// third party libraries
import { Button, Checkbox, Modal, ModalContent, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { useState } from "react";

const methods = ["使用内置循环", "使用游戏内宏", "使用lua编程语言"];

export const Fight = ({
    dataInput,
    updateInput,
    status,
}: {
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
    status: TypeStatus;
}) => {
    const [method, setMethod] = useState(dataInput.fight.method);
    const modal = useDisclosure();
    const valid = method === dataInput.fight.method;

    async function selectLuaFile() {
        const file = await readLua();
        if (file.length > 0) {
            updateInput((draft) => {
                draft.fight = {
                    method: methods[2],
                    data: file,
                };
            });
        }
    }
    function submitCustom(macros: string[]) {
        const data = macros.filter((item) => item !== ""); // 过滤空宏
        if (data.length > 0) {
            updateInput((draft) => {
                draft.fight = {
                    method: methods[1],
                    data: data,
                };
            });
        }
    }

    let selectHelper = <></>;
    let modalContent = (
        <ModalContent>
            <></>
        </ModalContent>
    );

    // 渲染
    switch (method) {
        case methods[0]:
            selectHelper = (
                <Checkbox
                    className="w-full"
                    isSelected={dataInput.fight.data === 1}
                    onValueChange={(isSelected: boolean) => {
                        updateInput((draft) => {
                            draft.fight = {
                                method: methods[0],
                                data: isSelected ? 1 : 0,
                            };
                        });
                    }}
                >
                    优先一键宏
                </Checkbox>
            );
            modalContent = <></>;
            break;
        case methods[2]:
            selectHelper = (
                <Button
                    onPress={selectLuaFile}
                    color={valid ? "success" : "danger"}
                    startContent={valid ? <FaCircleCheck /> : <FaCircleXmark />}
                    className=" min-w-min"
                >
                    选择lua文件
                </Button>
            );
            modalContent = <ModalLua selectLuaFile={selectLuaFile} />;
            break;
        case methods[1]:
            selectHelper = (
                <Button
                    onPress={modal.onOpen}
                    color={valid ? "success" : "danger"}
                    startContent={valid ? <FaCircleCheck /> : <FaCircleXmark />}
                    className=" min-w-min"
                >
                    重新输入
                </Button>
            );
            modalContent = <ModalMacro submitCustom={submitCustom} />;
            break;
        default:
            selectHelper = <></>;
            modalContent = <></>;
            break;
    }

    // 选择事件
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setMethod(e.target.value);
        // 重置 value
        updateInput((draft) => {
            draft.fight = {
                method: methods[0],
                data: 0,
            };
        });
        // 重置 valid
        modal.onOpen();
    }

    let selectItems = [];
    let length = methods.length;
    if (!status.data.custom) {
        length -= 1;
    }
    for (let i = 0; i < length; i++) {
        selectItems.push(
            <SelectItem key={methods[i]} value={methods[i]}>
                {methods[i]}
            </SelectItem>
        );
    }

    return (
        <div className="w-full flex justify-center items-center gap-8">
            <Select label="总开关" selectedKeys={[method]} onChange={handleChange} disallowEmptySelection>
                {selectItems}
            </Select>
            {selectHelper}
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
                {modalContent}
            </Modal>
        </div>
    );
};
