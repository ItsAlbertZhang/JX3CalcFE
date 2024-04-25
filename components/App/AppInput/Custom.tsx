"use client";
// child components
import { Fight } from "./Custom/Fight";
import { Talents } from "./Custom/Talents";
// my libraries
import { DataInput, TypeStatus } from "@/components/definitions";

export const Custom = ({
    dataInput,
    updateInput,
    status,
}: {
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
    status: TypeStatus;
}) => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
            <Talents dataInput={dataInput} updateInput={updateInput} />
            <Fight dataInput={dataInput} updateInput={updateInput} status={status} />
        </div>
    );
};
