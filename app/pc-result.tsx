// Page Component: Result
"use client";

import { iResponseQueryDps } from "./definitions";
import { Progress } from "@nextui-org/react";

export const Result = ({ Dps }: { Dps: iResponseQueryDps | object }) => {
    if (Object.keys(Dps).length > 0) {
        const data = (Dps as iResponseQueryDps).data;
        return (
            <>
                <Progress aria-label="计算中..." value={(data.current * 100) / data.total} className="max-w-md" />
                <p className="text-2xl">平均DPS: {data.avg}</p>
            </>
        );
    } else {
        return <></>;
    }
};
