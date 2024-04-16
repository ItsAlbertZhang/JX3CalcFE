"use client";
// child components
import { DamageAnalysis } from "./AppResult/DamageAnalysis";
import { DamageList } from "./AppResult/DamageList";
import { DistributeChart } from "./AppResult/DistributionChart";
import { TaskCompare } from "./AppResult/TasksCompare";
import { Result } from "./AppResult/Result";
// my libraries
import { TypeQueryDPS, TypeQueryDamageAnalysis, TypeQueryDamageList } from "@/components/definitions";
// third party libraries
import { motion } from "framer-motion";
import { Progress } from "@nextui-org/react";

export const AppResult = ({
    calcedOnce,
    dataDamageLists,
    dataDamageAnalysis,
    dataTaskMainDPS,
    dataCompareTasksDPS,
}: {
    calcedOnce: boolean;
    dataDamageLists: TypeQueryDamageList["data"] | undefined;
    dataDamageAnalysis: TypeQueryDamageAnalysis["data"] | undefined;
    dataTaskMainDPS: TypeQueryDPS["data"] | undefined;
    dataCompareTasksDPS: TypeQueryDPS["data"][];
}) => {
    if (!calcedOnce) {
        return <></>;
    }
    return (
        <div className="xl:col-span-2 grid grid-rows-9 gap-4 w-full h-full">
            <div className="row-span-4 grid gap-4 xl:grid-cols-2">
                {dataDamageLists ? <DamageList data={dataDamageLists} /> : <></>}
                {dataDamageAnalysis ? <DamageAnalysis data={dataDamageAnalysis} /> : <></>}
            </div>
            <div className="row-span-4 grid gap-4 xl:grid-cols-4">
                <motion.div
                    className={"xl:col-span-2" + (dataCompareTasksDPS.length > 0 ? "" : " xl:col-start-2")}
                    layout // Animate layout changes
                    transition={{ type: "spring", duration: 1, bounce: 0.33 }}
                >
                    {dataTaskMainDPS ? <DistributeChart data={dataTaskMainDPS} /> : <></>}
                </motion.div>
                {dataCompareTasksDPS.length > 0 ? (
                    <motion.div className="xl:col-span-2 flex flex-col justify-center items-center">
                        <TaskCompare
                            dataTaskMainDPS={dataTaskMainDPS as TypeQueryDPS["data"]}
                            dataCompareTasksDPS={dataCompareTasksDPS}
                        />
                    </motion.div>
                ) : (
                    <></>
                )}
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
                {dataTaskMainDPS ? (
                    <>
                        <Progress
                            aria-label="CalcDPS"
                            value={(() => {
                                let current = dataTaskMainDPS.current;
                                let total = dataTaskMainDPS.total;
                                for (const data of dataCompareTasksDPS) {
                                    current += data.current;
                                    total += data.total;
                                }
                                return (current * 100) / total;
                            })()}
                            className="max-w-md"
                        />
                        <Result
                            avg={dataTaskMainDPS.avg}
                            sd={dataTaskMainDPS.sd}
                            ci={dataTaskMainDPS.ci99}
                            n={dataTaskMainDPS.current}
                        />
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};
