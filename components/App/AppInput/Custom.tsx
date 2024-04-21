"use client";
// my libraries
import { openUrl, readLua } from "@/components/actions";
import { DataInput, TypeStatus } from "@/components/definitions";
import { Talent, talentHd, talentExp } from "@/components/default";

// third party libraries
import {
    Button,
    Image,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select,
    SelectItem,
    Textarea,
    useDisclosure,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { IoAddCircle } from "react-icons/io5";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { useState } from "react";

const methods = ["使用内置循环", "使用lua编程语言", "使用游戏内宏"];
const help = "http://jx3calc.com/help/custom";

const ModalLua = ({
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

const ModalMacro = ({ submitCustom }: { submitCustom: (macros: string[]) => void }) => {
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

const Head = ({
    method,
    setMethod,
    dataInput,
    updateInput,
    talent,
}: {
    method: string;
    setMethod: (value: string) => void;
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
    talent: Talent[][];
}) => {
    const [valid, setValid] = useState(dataInput.custom && dataInput.custom.fight.data.length > 0); // 是否已经选择了lua文件或输入了宏
    const [warned, setWarned] = useState(false); // lua 的警告 modal 是否已经弹出过

    const modal = useDisclosure();

    async function selectLuaFile() {
        const file = await readLua();
        if (file.length > 0) {
            updateInput((draft) => {
                draft.custom = {
                    fight: {
                        method: "使用lua编程语言",
                        data: file,
                    },
                    talent: talent.map((item) => item[0].skillID),
                };
            });
            setValid(true);
        } else {
            // 重置 value
            updateInput((draft) => {
                delete draft.custom;
            });
            // 重置 valid
            setValid(false);
        }
    }
    function submitCustom(macros: string[]) {
        const data = macros.filter((item) => item !== ""); // 过滤空宏
        if (data.length > 0) {
            updateInput((draft) => {
                draft.custom = {
                    fight: {
                        method: "使用游戏内宏",
                        data: data,
                    },
                    talent: talent.map((item) => item[0].skillID),
                };
            });
            setValid(true);
        } else {
            // 重置 value
            updateInput((draft) => {
                delete draft.custom;
            });
            // 重置 valid
            setValid(false);
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
        case methods[1]:
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
            modalContent = <ModalLua setWarned={setWarned} setMethod={setMethod} selectLuaFile={selectLuaFile} />;
            break;
        case methods[2]:
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
            delete draft.custom;
        });
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
        <motion.div
            layout // Animate layout changes
            transition={{ type: "spring", duration: 1, bounce: 0.33 }}
            className="w-full flex justify-center items-center gap-8"
        >
            <Select label="总开关" selectedKeys={[method]} onChange={handleChange} disallowEmptySelection>
                {methods.map((item) => (
                    <SelectItem key={item} value={item}>
                        {item}
                    </SelectItem>
                ))}
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
        </motion.div>
    );
};

const SelectItemRender = ({ item }: { item: Talent }) => {
    return (
        <div key={item.skillID.toString()} className="flex gap-2">
            <Image width={32} alt={item.name} src={`https://icon.jx3box.com/icon/${item.iconID}.png`} />
            <div className="flex flex-col justify-center items-center">
                <p>{item.name}</p>
            </div>
        </div>
    );
};

// TODO: 重构渲染逻辑, 重选 method 时不重置 content
const Content = ({
    dataInput,
    updateInput,
    talent,
}: {
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
    talent: Talent[][];
}) => {
    const qixue = talent.map((items, idx) => (
        <Select
            key={idx}
            aria-label={`第${idx + 1}重`}
            size="lg"
            disallowEmptySelection
            selectedKeys={dataInput.custom ? [dataInput.custom.talent[idx].toString()] : []}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                updateInput((draft) => {
                    draft.custom!.talent[idx] = parseInt(e.target.value);
                });
            }}
            items={items}
            renderValue={(items) => {
                return items.map((item, index) =>
                    item.data ? <SelectItemRender key={index} item={item.data} /> : <></>
                );
            }}
        >
            {(item) => (
                <SelectItem key={item.skillID.toString()} aria-label={`qx${item.skillID}`}>
                    <SelectItemRender item={item} />
                </SelectItem>
            )}
        </Select>
    ));

    return (
        <div className="grow w-full flex flex-col justify-center items-center gap-8">
            <div className="w-full grid grid-cols-3 justify-items-center items-center gap-2">{qixue}</div>
        </div>
    );
};

export const Custom = ({
    dataInput,
    updateInput,
    status,
}: {
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
    status: TypeStatus["data"];
}) => {
    const [method, setMethod] = useState(dataInput.custom ? dataInput.custom.fight.method : methods[0]); // 选用的方法
    const talent = status.isExp ? talentExp : talentHd;

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
            <Head
                method={method}
                setMethod={setMethod}
                dataInput={dataInput}
                updateInput={updateInput}
                talent={talent}
            />
            {method !== methods[0] ? (
                <Content dataInput={dataInput} updateInput={updateInput} talent={talent} />
            ) : (
                <></>
            )}
        </div>
    );
};
