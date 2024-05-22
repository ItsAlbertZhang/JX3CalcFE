"use client";
// child components
import { FightType } from "./Fight/FightType";
import { Talents } from "./Fight/Talents";
// my libraries
import { DataInput } from "@/components/definitions";

export const Fight = ({
    dataInputs,
    page,
    updateInputs,
    updateInput,
    setPage,
    allowLua,
}: {
    dataInputs: DataInput[];
    page: number;
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    updateInput: (fn: (draft: DataInput) => void) => void;
    setPage: (page: number) => void;
    allowLua: boolean;
}) => {
    const index = page - 1;
    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
            <Talents dataInput={dataInputs[index]} updateInput={updateInput} />
            <FightType
                dataInputs={dataInputs}
                updateInputs={updateInputs}
                page={page}
                setPage={setPage}
                allowLua={allowLua}
            />
        </div>
    );
};
