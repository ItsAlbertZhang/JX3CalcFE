"use client";
// child components simple
import { DamageAnalysis } from "./damage-analysis";
import { DamageList } from "./damage-list";
import { DPS } from "./dps";

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
};

export const Result = ({ status, setStatus }: { status: string; setStatus: (value: string) => void }) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full gap-8">
            <div className="flex flex-col justify-center items-center w-full h-full basis-1/2 gap-8 2xl:flex-row 2xl:h-1/2">
                <div className="w-full h-full basis-1/2">
                    <DamageList status={status} />
                </div>

                <div className="w-full h-full basis-1/2">
                    <DamageAnalysis status={status} />
                </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full h-full basis-1/2 gap-8 2xl:flex-row 2xl:h-1/2">
                <div className="w-full h-full">
                    <DPS status={status} setStatus={setStatus} />
                </div>
            </div>
        </div>
    );
};
