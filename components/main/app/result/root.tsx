"use client";

import { iResponseQueryDps } from "@/components/definitions";

import { Progress } from "@nextui-org/react";

export const Result = ({ dps }: { dps: iResponseQueryDps["data"] | undefined }) => {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-8">
            <Progress aria-label="计算中..." value={dps ? (dps.current * 100) / dps.total : 50} className="max-w-md" />
            <p className="text-2xl">{dps ? `平均DPS: ${dps.avg}` : "等待输入..."}</p>
        </div>
    );
};
