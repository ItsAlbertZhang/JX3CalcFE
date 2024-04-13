"use client";
// child components
import { Loading } from "./Loading";
import { Setting, fetchServerStatus } from "./Setting";
import { Updating } from "./Updating";
import { WebTips } from "./App/WebTips";
import { Attribute } from "./App/AppInput/Attribute";
import { Custom } from "./App/AppInput/Custom";
import { Effects } from "./App/AppInput/Effects";
import { Global } from "./App/AppInput/Global";
import { DamageAnalysis } from "./App/AppResult/DamageAnalysis";
import { DamageList } from "./App/AppResult/DamageList";
import { DistributeChart } from "./App/AppResult/DistributionChart";
import { Result } from "./App/AppResult/Result";
// my libraries
import { createTask, queryDamageAnalysis, queryDamageList, queryDps } from "./actions";
import {
    DataInput,
    TypeBackendRes,
    TypeQueryDamageAnalysis,
    TypeQueryDamageList,
    TypeQueryDPS,
    TypeStatus,
    TypeString,
} from "@/components/definitions";
// third party libraries
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { Button, Progress } from "@nextui-org/react";

const VERSION = "v1.1";
const QUERY_INTERVAL = 500;
async function wait(ms: number = QUERY_INTERVAL) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const App = () => {
    const [status, setStatus] = useState<TypeStatus>();
    useEffect(() => {
        fetchServerStatus().then(setStatus);
    }, []);
    const [dataInputs, updateInputs] = useImmer<DataInput[]>([new DataInput()]);
    const [calculating, setCalculating] = useState<boolean>(false);
    const [dataDamageAnalysis, setDataDamageAnalysis] = useState<TypeQueryDamageAnalysis["data"]>();
    const [dataDamageLists, setDataDamageLists] = useState<TypeQueryDamageList["data"]>();
    const [dataTaskMainDPS, setDataMainTaskDPS] = useState<TypeQueryDPS["data"]>();
    const [dataCompareTasksDPS, setDataCompareTasksDPS] = useState<TypeQueryDPS["data"][]>([]);
    const [CalcedOnce, setCalcedOnce] = useState<boolean>(false);

    async function calc() {
        setCalcedOnce(true);
        setCalculating(true);

        const response = (await createTask(dataInputs[0])) as TypeString;
        if (response.status === 0) {
            const id = response.data;
            await wait();
            while (true) {
                const response = (await queryDamageList(id)) as TypeBackendRes;
                if (response.status === 0) {
                    setDataDamageLists(response.data);
                    break;
                } else {
                    await wait();
                }
            }
            while (true) {
                const response = (await queryDamageAnalysis(id)) as TypeBackendRes;
                if (response.status === 0) {
                    setDataDamageAnalysis(response.data);
                    break;
                } else {
                    await wait();
                }
            }
            while (true) {
                const response = (await queryDps(id)) as TypeBackendRes;
                if (response.status === 0) {
                    setDataMainTaskDPS(response.data);
                    if (response.data.complete) {
                        break;
                    }
                }
                await wait();
            }
        } else {
            console.log(response.data);
        }

        for (let i = 1; i < dataInputs.length; i++) {
            const response = (await createTask(dataInputs[i])) as TypeString;
            if (response.status === 0) {
                const id = response.data;
                await wait();
                while (true) {
                    const response = (await queryDps(id)) as TypeBackendRes;
                    if (response.status === 0) {
                        setDataCompareTasksDPS([...dataCompareTasksDPS, response.data]);
                        if (response.data.complete) {
                            break;
                        }
                    }
                    await wait();
                }
            } else {
                console.log(response.data);
            }
        }

        setCalculating(false);
    }

    function updateInput(fn: (draft: DataInput) => void) {
        updateInputs((draft) => {
            // 需要创建一个新的数组, 因为 React 对变化的检测是基于引用进行的
            const newDraft = [...draft];
            fn(newDraft[0]);
            return newDraft;
        });
    }

    return (
        <div
            className="
                p-6 m-auto
                w-full md:w-4/5 lg:w-2/3 xl:w-full
                min-h-screen xl:max-h-screen
                flex justify-center items-center"
        >
            {!status ? (
                <Loading />
            ) : status.status !== 0 ? (
                <Setting setStatus={setStatus} />
            ) : !status.data.version.startsWith(VERSION) ? (
                <Updating />
            ) : (
                <div
                    className="
                        w-full h-full
                        flex flex-col gap-8
                        xl:grid xl:grid-cols-3
                        justify-center justify-items-center items-center"
                >
                    <WebTips />
                    <motion.div
                        className={
                            (CalcedOnce ? "" : "xl:col-start-2 ") + "flex flex-col justify-center items-center gap-8"
                        }
                        layout // Animate layout changes
                        transition={{ type: "spring", duration: 1, bounce: 0.33 }}
                    >
                        <div className="basis-full flex flex-col justify-center items-center gap-8">
                            <Global dataInput={dataInputs[0]} updateInput={updateInput} status={status.data} />
                            <Attribute dataInput={dataInputs[0]} updateInput={updateInput} />
                            <Custom dataInput={dataInputs[0]} updateInput={updateInput} status={status.data} />
                            <Effects dataInput={dataInputs[0]} updateInput={updateInput} />
                        </div>
                        <Button isDisabled={calculating} onPress={calc} color="primary">
                            计算
                        </Button>
                    </motion.div>
                    {CalcedOnce ? (
                        <div className="col-span-2 grid grid-rows-9 gap-4 w-full h-full">
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
                    ) : (
                        <></>
                    )}
                </div>
            )}
        </div>
    );
};
