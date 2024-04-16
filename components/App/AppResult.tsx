"use client";
// child components
import { DamageAnalysis } from "./AppResult/DamageAnalysis";
import { DamageList } from "./AppResult/DamageList";
import { DistributeChart } from "./AppResult/DistributionChart";
import { Result } from "./AppResult/Result";
// my libraries
import { TypeQueryDPS, TypeQueryDamageAnalysis, TypeQueryDamageList } from "@/components/definitions";
// third party libraries
import { Progress } from "@nextui-org/react";

export const AppResult = ({
    calcedOnce,
    dataDamageLists,
    dataDamageAnalysis,
    dataTaskMainDPS,
}: {
    calcedOnce: boolean;
    dataDamageLists: TypeQueryDamageList["data"] | undefined;
    dataDamageAnalysis: TypeQueryDamageAnalysis["data"] | undefined;
    dataTaskMainDPS: TypeQueryDPS["data"] | undefined;
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
            <div className={"row-span-4 grid gap-4" + (true ? "" : " xl:grid-cols-2")}>
                {dataTaskMainDPS ? <DistributeChart data={dataTaskMainDPS} /> : <></>}
                {/* {id.length !== 0 ? (
                    <></>
                ) : n === 0 ? (
                    <AttributeBenefit dps={dps.avg} setCalculating={setCalculating} />
                ) : (
                    <AttributeBenefitNotAvailable n={n} />
                )} */}
            </div>
            <div className="flex flex-col justify-center items-center gap-2">
                {dataTaskMainDPS ? (
                    <>
                        <Progress
                            aria-label="CalcDPS"
                            value={(dataTaskMainDPS.current * 100) / dataTaskMainDPS.total}
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
