"use client";
// child components simple
import { DamageAnalysis } from "./damage-analysis";
import { DamageList } from "./damage-list";
import { DPS } from "./dps";
// third party libraries
import { motion } from "framer-motion";

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
};

export const Result = ({
    id,
    setID,
    setCalculating,
    userinputLatest,
}: {
    id: string;
    setID: (value: string) => void;
    setCalculating: (value: boolean) => void;
    userinputLatest: any;
}) => {
    return (
        <div className="basis-full flex flex-col gap-8">
            <motion.div layout className="basis-full flex flex-col gap-8 2xl:flex-row">
                <DamageList id={id} />
                <DamageAnalysis id={id} />
            </motion.div>
            <DPS id={id} setID={setID} setCalculating={setCalculating} />
        </div>
    );
};
