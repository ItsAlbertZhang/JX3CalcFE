"use client";
// child components
import { Attribute } from "./AppInput/Attribute";
import { Custom } from "./AppInput/Custom";
import { Effects } from "./AppInput/Effects";
import { Global } from "./AppInput/Global";
// my libraries
import { DataInput, TypeStatus } from "@/components/definitions";
// third party libraries
import { Button, Input, Tab, Tabs, Tooltip, Pagination } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaRegCopy, FaRegTrashCan } from "react-icons/fa6";

const InputOnly = ({
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
    const classname = "flex flex-col justify-center items-center gap-8";
    const global = (
        <Tab key="Global" title="通用" className={classname + " grow"}>
            <Global dataInput={dataInputs[index]} updateInput={updateInput} status={status.data} />
        </Tab>
    );
    const attribute = (
        <Tab key="Attribute" title="属性" className={classname + " grow"}>
            <Attribute dataInputs={dataInputs} updateInputs={updateInputs} page={page} setPage={setPage} />
            <Effects dataInput={dataInputs[index]} updateInput={updateInput} />
        </Tab>
    );
    const custom = status.data.custom ? (
        <Tab key="Custom" title="战斗" className={classname + " grow"}>
            <Custom dataInput={dataInputs[index]} updateInput={updateInput} status={status.data} />
        </Tab>
    ) : (
        <></>
    );
    const benefits = (
        <Tab key="Benefits" title="增益" className={classname + " grow"}>
            <p>Coding...</p>
        </Tab>
    );
    return (
        <Tabs className={classname} disabledKeys={["Benefits"]} color="warning" radius="full">
            {global}
            {attribute}
            {custom}
            {benefits}
        </Tabs>
    );
};

const Page = ({
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
    const index = page - 1;
    function copyCurrentPage() {
        updateInputs((draft) => {
            const deepCopy: DataInput = JSON.parse(JSON.stringify(draft[index]));
            deepCopy.name = "P" + (index + 2);
            draft.splice(index + 1, 0, deepCopy);
        });
        setPage(page + 1);
    }
    function delCurrentPage() {
        if (dataInputs.length === 1) return;
        updateInputs((draft) => {
            draft.splice(index, 1);
            draft[0].name = "基准页";
        });
        if (page > 1) {
            setPage(page - 1);
        }
    }
    return (
        <div className="flex justify-between items-center gap-2">
            <Tooltip content="复制当前页">
                <Button isIconOnly variant="ghost" color="success" onClick={copyCurrentPage}>
                    <FaRegCopy size={16} />
                </Button>
            </Tooltip>
            <Pagination total={dataInputs.length} showControls loop showShadow page={page} onChange={setPage} />
            <Tooltip content="删除当前页">
                <Button isIconOnly variant="ghost" color="danger" onClick={delCurrentPage}>
                    <FaRegTrashCan size={16} />
                </Button>
            </Tooltip>
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
    return (
        <motion.div
            style={{ height: "calc(100vh - 1.5rem * 2)" }}
            // 1.5rem: p-6
            // see https://tailwindcss.com/docs/padding
            className={(classNameAdd ? classNameAdd + " " : "") + "w-full flex flex-col gap-4"}
            layout // Animate layout changes
            transition={{ type: "spring", duration: 1, bounce: 0.33 }}
        >
            <div className="flex justify-center items-center">
                <Input
                    value={dataInputs[page - 1].name}
                    onChange={(e) => {
                        updateInputs((draft) => {
                            draft[page - 1].name = e.target.value;
                        });
                    }}
                    isDisabled={page === 1}
                    classNames={{ input: "text-center text-xl font-bold" }}
                    className="w-1/3"
                />
            </div>
            <InputOnly
                dataInputs={dataInputs}
                updateInputs={updateInputs}
                status={status}
                page={page}
                setPage={setPage}
            />
            <Page dataInputs={dataInputs} updateInputs={updateInputs} page={page} setPage={setPage} />
            <Button isDisabled={calculating} onPress={calc} color="primary">
                计算
            </Button>
        </motion.div>
    );
};
