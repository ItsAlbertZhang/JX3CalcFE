"use client";
// child components simple
import { Effect, TypeOption } from "./Common";
// my libraries
import { DataInput, TypeStatus } from "@/components/definitions";

export const Effects = ({
    status,
    dataInput,
    updateInput,
}: {
    status: TypeStatus;
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
}) => {
    interface Effects {
        [key: string]: {
            span: number;
            options: TypeOption[] | string[] | null;
        };
    }
    const effects: Effects = {
        "大附魔·腰": { span: 2, options: null },
        "大附魔·腕": { span: 2, options: ["风语-高品", "风语-低品"] },
        "大附魔·鞋": { span: 2, options: ["风语-高品", "风语-低品"] },
        "套装·技能": { span: 2, options: null },
        "套装·特效": { span: 2, options: null },
        "腰坠·特效": { span: 2, options: ["寻幽径"] },
        "家园·酿造": { span: 3, options: ["女儿红·旬又三", "女儿红"] },
        "武器·特效": {
            span: 3,
            options: [
                { name: "大橙武", color: "orange" },
                { name: "小橙武", color: "orange" },
                { name: "阅世悲", color: "default" },
            ],
        },
    };
    const ret = Object.entries(effects).map(([name, attrib], idx) => (
        <Effect
            key={"effect" + name}
            className={`col-span-${attrib.span - 1} xl:col-span-${attrib.span}`}
            name={name}
            dataInput={dataInput}
            updateInput={updateInput}
            options={attrib.options}
        />
    ));
    return (
        <div className={`w-full grid grid-flow-row grid-cols-2 xl:grid-cols-6 justify-items-center items-center gap-3`}>
            {ret}
        </div>
    );
};
