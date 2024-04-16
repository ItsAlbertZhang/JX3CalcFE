"use client";
// child components
import { Attribute } from "./AppInput/Attribute";
import { Custom } from "./AppInput/Custom";
import { Effects } from "./AppInput/Effects";
import { Global } from "./AppInput/Global";
// my libraries
import { DataInput, TypeStatus } from "@/components/definitions";
// third party libraries
import { Button, Tab, Tabs, Pagination } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaRegCopy, FaRegTrashCan } from "react-icons/fa6";

const InputOnly = ({
    dataInputs,
    updateInputs,
    status,
    page,
}: {
    dataInputs: DataInput[];
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    status: TypeStatus;
    page: number;
}) => {
    const index = page - 1;
    // temporary function to update the input
    function updateInput(fn: (draft: DataInput) => void) {
        updateInputs((draft) => {
            fn(draft[index]);
        });
    }
    const classname = "flex flex-col justify-center items-center gap-8";
    return (
        <div className="row-span-10">
            <Tabs className={classname} disabledKeys={["Benefits"]} color="warning" radius="full">
                <Tab key="Global" title="通用" className={classname + " h-full"}>
                    <Global dataInput={dataInputs[index]} updateInput={updateInput} status={status.data} />
                </Tab>
                <Tab key="Attribute" title="属性" className={classname + " h-full"}>
                    <Attribute dataInput={dataInputs[index]} updateInput={updateInput} />
                    <Effects dataInput={dataInputs[index]} updateInput={updateInput} />
                </Tab>
                <Tab key="Custom" title="战斗" className={classname + " h-full"}>
                    <Custom dataInput={dataInputs[index]} updateInput={updateInput} status={status.data} />
                </Tab>
                <Tab key="Benefits" title="增益" className={classname + " h-full"}>
                    <p>Coding...</p>
                </Tab>
            </Tabs>
        </div>
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
            const deepCopy = JSON.parse(JSON.stringify(draft[index]));
            draft.splice(index + 1, 0, deepCopy);
        });
        setPage(page + 1);
    }
    function delCurrentPage() {
        if (dataInputs.length === 1) return;
        updateInputs((draft) => {
            draft.splice(index, 1);
        });
        if (page > 1) {
            setPage(page - 1);
        }
    }
    return (
        <div className="flex justify-center items-center gap-2">
            <Button isIconOnly variant="ghost" color="success" onClick={copyCurrentPage}>
                <FaRegCopy size={16} />
            </Button>
            <Pagination total={dataInputs.length} showControls loop showShadow page={page} onChange={setPage} />
            <Button isIconOnly variant="ghost" color="danger" onClick={delCurrentPage}>
                <FaRegTrashCan size={16} />
            </Button>
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
            className={(classNameAdd ? classNameAdd + " " : "") + "grid grid-rows-12 gap-4 w-full min-h-[80vh]"}
            layout // Animate layout changes
            transition={{ type: "spring", duration: 1, bounce: 0.33 }}
        >
            <InputOnly dataInputs={dataInputs} updateInputs={updateInputs} status={status} page={page} />
            <Page dataInputs={dataInputs} updateInputs={updateInputs} page={page} setPage={setPage} />
            <Button isDisabled={calculating} onPress={calc} color="primary">
                计算
            </Button>
        </motion.div>
    );
};
