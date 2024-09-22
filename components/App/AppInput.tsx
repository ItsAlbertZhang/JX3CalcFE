"use client";
// child components
import { Attribute } from "./AppInput/Attribute";
import { Fight } from "./AppInput/Fight";
import { Effects } from "./AppInput/Effects";
import { Global } from "./AppInput/Global";
import { Benefits } from "./AppInput/Benefits";
// my libraries
import { isApp, readClipboard, switchTo, writeClipboard } from "@/components/actions";
import { DataInput, TypeStatus } from "@/components/definitions";
// third party libraries
import {
    Button,
    Input,
    Tab,
    Tabs,
    Tooltip,
    Pagination,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Divider,
    Spacer,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowRightToBracket, FaArrowUpFromBracket, FaRegCopy, FaRegTrashCan, FaRepeat } from "react-icons/fa6";

const InputContent = ({
    dataInputs,
    updateInputs,
    status,
    page,
    setPage,
}: {
    dataInputs: DataInput[];
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    status: TypeStatus;
    page: number;
    setPage: (page: number) => void;
}) => {
    const index = page - 1;
    // temporary function to update the input
    function updateInput(fn: (draft: DataInput) => void) {
        updateInputs((draft) => {
            fn(draft[index]);
        });
    }
    const classname = "flex flex-col items-center gap-8";
    const global = (
        <Tab key="Global" title="通用" className={classname + " justify-center"}>
            <Global dataInput={dataInputs[index]} updateInput={updateInput} status={status.data} />
        </Tab>
    );
    const attribute = (
        <Tab key="Attribute" title="属性" className={classname + " justify-center"}>
            <Attribute
                dataInputs={dataInputs}
                status={status}
                updateInputs={updateInputs}
                page={page}
                setPage={setPage}
            />
            <Effects dataInput={dataInputs[index]} updateInput={updateInput} />
        </Tab>
    );
    const fight = (
        <Tab key="Custom" title="战斗" className={classname + " justify-center"}>
            <Fight
                dataInputs={dataInputs}
                page={page}
                updateInputs={updateInputs}
                updateInput={updateInput}
                setPage={setPage}
                allowLua={status.data.custom}
            />
        </Tab>
    );
    const benefits = (
        <Tab key="Benefits" title="增益" className={classname}>
            <Benefits
                dataInputs={dataInputs}
                page={page}
                updateInputs={updateInputs}
                updateInput={updateInput}
                setPage={setPage}
            />
        </Tab>
    );
    return (
        <Tabs className={classname} color="warning" radius="full" classNames={{ panel: "grow overflow-auto" }}>
            {global}
            {attribute}
            {fight}
            {status.data.client === "jx3_hd" ? benefits : null}
        </Tabs>
    );
};

const PageBar = ({
    dataInputs,
    updateInputs,
    page,
    setPage,
    calculating,
    calc,
}: {
    dataInputs: DataInput[];
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    page: number;
    setPage: (page: number) => void;
    calculating: boolean;
    calc: () => void;
}) => {
    const index = page - 1;
    const buttonContent = index === 0 ? "计算" : "回到基准页";
    function buttonOnPress() {
        if (index === 0) {
            calc();
        } else {
            setPage(1);
        }
    }
    async function pageExportCurr() {
        writeClipboard(JSON.stringify(dataInputs[index]));
    }
    async function pageImportCurr() {
        const text = await readClipboard();
        if (text === "") return;
        const obj = JSON.parse(text) as DataInput;
        // check if the object is valid
        if (
            typeof obj.player !== "string" ||
            typeof obj.delayNetwork !== "number" ||
            typeof obj.delayKeyboard !== "number" ||
            typeof obj.fightTime !== "number" ||
            typeof obj.fightCount !== "number" ||
            typeof obj.attribute !== "object"
        )
            return;
        updateInputs((draft) => {
            draft[index] = obj;
        });
    }
    async function pageCopyCurr() {
        updateInputs((draft) => {
            const deepCopy: DataInput = JSON.parse(JSON.stringify(draft[index]));
            deepCopy.name = "P" + (index + 2);
            draft.splice(index + 1, 0, deepCopy);
        });
        setPage(page + 1);
    }
    async function pageDeleteNotFirst() {
        if (dataInputs.length === 1) return;
        updateInputs((draft) => {
            draft.splice(1, draft.length - 1);
            draft[0].name = "基准页";
        });
        setPage(1);
    }
    async function pageDeleteCurr() {
        if (dataInputs.length === 1) return;
        updateInputs((draft) => {
            draft.splice(index, 1);
            draft[0].name = "基准页";
        });
        if (page > 1) {
            setPage(page - 1);
        }
    }
    async function pageDeleteOther() {
        if (dataInputs.length === 1) return;
        updateInputs((draft) => {
            draft.splice(0, index);
            draft.splice(1, draft.length - 1);
            draft[0].name = "基准页";
        });
        setPage(1);
    }
    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <Pagination total={dataInputs.length} showControls loop showShadow page={page} onChange={setPage} />
            <div className="w-full flex justify-between items-center gap-2">
                <Tooltip content="导出页面至剪切板">
                    <Button isIconOnly variant="ghost" onPress={pageExportCurr}>
                        <FaArrowUpFromBracket size={16} />
                    </Button>
                </Tooltip>
                <Tooltip content="从剪切板导入页面">
                    <Button isIconOnly variant="ghost" onPress={pageImportCurr}>
                        <FaArrowRightToBracket size={16} />
                    </Button>
                </Tooltip>
                <Tooltip
                    isDisabled={dataInputs.length === 1}
                    content={
                        <p className="w-full text-neutral-400 text-xs -indent-2 px-2">
                            * 第1页会被作为基准页详细计算
                            <br />
                            后续页面则仅会计算其DPS结果与基准页的差异
                        </p>
                    }
                >
                    <Button isDisabled={calculating} onPress={buttonOnPress} color="primary" className="w-full mx-4">
                        {buttonContent}
                    </Button>
                </Tooltip>
                <Tooltip content="复制当前页面">
                    <Button isIconOnly variant="ghost" color="success" onPress={pageCopyCurr}>
                        <FaRegCopy size={16} />
                    </Button>
                </Tooltip>
                <Dropdown>
                    <DropdownTrigger>
                        <Button isIconOnly variant="ghost" color="danger">
                            <FaRegTrashCan size={16} color="red" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem
                            key="delete-not-first"
                            className="text-danger"
                            color="danger"
                            onPress={pageDeleteNotFirst}
                        >
                            删除非基准页
                        </DropdownItem>
                        <DropdownItem key="delete-curr" className="text-danger" color="danger" onPress={pageDeleteCurr}>
                            删除当前页
                        </DropdownItem>
                        <DropdownItem
                            key="delete-other"
                            className="text-danger"
                            color="danger"
                            onPress={pageDeleteOther}
                        >
                            删除非当前页
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
};

export const AppInput = ({
    dataInputs,
    updateInputs,
    status,
    calculating,
    calc,
    classNameAdd,
}: {
    dataInputs: DataInput[];
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    status: TypeStatus;
    calculating: boolean;
    calc: () => void;
    classNameAdd?: string;
}) => {
    const [page, setPage] = useState(1);
    const [app, setApp] = useState(false);

    let style: object = { minHeight: "calc(100vh - 1.5rem * 2)" };
    if (window.matchMedia("(min-width: 1280px)").matches) {
        style = {
            ...style,
            maxHeight: "calc(100vh - 1.5rem * 2)",
        };
    }

    useEffect(() => {
        async function f() {
            if (await isApp()) {
                setApp(true);
            }
        }
        f();
    }, [setApp]);

    async function switchClient() {
        switch (status.data.client) {
            case "jx3_hd":
                await switchTo("jx3_exp");
                break;
            case "jx3_exp":
                await switchTo("jx3_hd");
                break;
            default:
                break;
        }
    }
    const spanHD = <span className="text-blue-500">{"正式服"}</span>;
    const spanEXP = <span className="text-purple-500">{"测试服"}</span>;
    const tooltipContent = (
        <>
            <p>切换客户端</p>
            <Spacer y={1} />
            <Divider />
            <Spacer y={1} />
            <p>当前客户端为: {status.data.client === "jx3_hd" ? spanHD : spanEXP}</p>
            <p>点击可切换至: {status.data.client === "jx3_hd" ? spanEXP : spanHD}</p>
        </>
    );

    return (
        <motion.div
            style={style}
            // 1.5rem: p-6
            // see https://tailwindcss.com/docs/padding
            className={(classNameAdd ? classNameAdd + " " : "") + "xl:col-span-4 w-full flex flex-col gap-4"}
            layout // Animate layout changes
            transition={{ type: "spring", duration: 1, bounce: 0.33 }}
        >
            <div className="flex justify-center items-center gap-2">
                {app ? (
                    <Tooltip content={tooltipContent}>
                        <Button
                            isIconOnly
                            variant="solid"
                            color={status.data.client === "jx3_hd" ? "primary" : "secondary"}
                            onPress={switchClient}
                        >
                            <FaRepeat size={16} />
                        </Button>
                    </Tooltip>
                ) : (
                    <></>
                )}

                <Input
                    value={dataInputs[page - 1].name}
                    onChange={(e) => {
                        updateInputs((draft) => {
                            draft[page - 1].name = e.target.value;
                        });
                    }}
                    isDisabled={page === 1}
                    classNames={{ input: "text-center text-xl" }}
                    className="w-full xl:w-1/2"
                />
            </div>
            <InputContent
                dataInputs={dataInputs}
                updateInputs={updateInputs}
                status={status}
                page={page}
                setPage={setPage}
            />
            <PageBar
                dataInputs={dataInputs}
                updateInputs={updateInputs}
                page={page}
                setPage={setPage}
                calculating={calculating}
                calc={calc}
            />
        </motion.div>
    );
};
