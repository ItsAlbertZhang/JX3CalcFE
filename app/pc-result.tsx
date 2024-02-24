// Page Component: Result
"use client";

import { Progress } from "@nextui-org/react";

interface iResponseBase {
    status: number;
    data: any;
}
export interface iResultDps extends iResponseBase {
    data: {
        complete: boolean;
        current: number;
        total: number;
        speed: number;
        avg: number;
        sd: number;
        list: number[];
    };
}

export const Result = ({ Dps }: { Dps: iResultDps | object }) => {
    if (Object.keys(Dps).length > 0) {
        const data = (Dps as iResultDps).data;
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
