"use client";
// child components
import { Loading } from "./Loading";
import { Setting, fetchServerStatus } from "./Setting";
import { Updating } from "./Updating";
import { WebTips } from "./App/WebTips";
import { AppInput } from "./App/AppInput";
import { AppResult } from "./App/AppResult";
// my libraries
import { createTask, queryDamageAnalysis, queryDamageList, queryDps } from "@/components/actions";
import {
    DataInput,
    TypeBackendRes,
    TypeQueryDamageAnalysis,
    TypeQueryDamageList,
    TypeQueryDPS,
    TypeStatus,
    TypeString,
} from "@/components/definitions";
import { defaultDataInput } from "@/components/default";
// third party libraries
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

const VERSION = "v1.1.1";
const QUERY_INTERVAL = 500;
async function wait(ms: number = QUERY_INTERVAL) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const App = () => {
    const [status, setStatus] = useState<TypeStatus>();
    useEffect(() => {
        fetchServerStatus().then(setStatus);
    }, []);
    const [dataInputs, updateInputs] = useImmer<DataInput[]>([defaultDataInput]);
    const [calculating, setCalculating] = useState<boolean>(false);
    const [dataDamageAnalysis, setDataDamageAnalysis] = useState<TypeQueryDamageAnalysis["data"]>();
    const [dataDamageLists, setDataDamageLists] = useState<TypeQueryDamageList["data"]>();
    const [dataTaskMainDPS, setDataMainTaskDPS] = useState<TypeQueryDPS["data"]>();
    const [dataCompareTasksDPS, updateDataCompareTasksDPS] = useImmer<TypeQueryDPS["data"][]>([]);
    const [dataCompareTasksName, setDataCompareTasksName] = useState<string[]>([]);
    const [calcedOnce, setCalcedOnce] = useState<boolean>(false);

    async function calc() {
        setCalcedOnce(true);
        setCalculating(true);
        updateDataCompareTasksDPS(() => []);

        const data = dataInputs.map((item) => {
            const obj = {
                ...item,
                attribute: {
                    ...item.attribute,
                    data: {
                        ...item.attribute.data,
                        MeleeWeaponDamageRand:
                            item.attribute.data.MeleeWeaponDamageMax - item.attribute.data.MeleeWeaponDamage,
                    },
                },
            };
            return JSON.stringify(obj);
        });
        const names = dataInputs.slice(1).map((item) => item.name);
        setDataCompareTasksName(names);

        const response = (await createTask(data[0])) as TypeString;
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
            const response = (await createTask(data[i])) as TypeString;
            if (response.status === 0) {
                const id = response.data;
                await wait();
                let pushed = false;
                while (true) {
                    const response = (await queryDps(id)) as TypeBackendRes;
                    if (response.status === 0) {
                        if (!pushed) {
                            updateDataCompareTasksDPS((draft) => {
                                draft.push(response.data);
                            });
                            pushed = true;
                        } else {
                            updateDataCompareTasksDPS((draft) => {
                                draft[draft.length - 1] = response.data;
                            });
                        }
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

    let content: JSX.Element;
    if (!status) {
        content = <Loading />;
    } else if (status.status !== 0) {
        content = <Setting setStatus={setStatus} />;
    } else if (!status.data.version.startsWith(VERSION)) {
        content = <Updating />;
    } else {
        content = (
            <div
                className="
                        w-full h-full
                        flex flex-col gap-8
                        xl:grid xl:grid-cols-3
                        justify-center justify-items-center items-center"
            >
                <WebTips />
                <AppInput
                    dataInputs={dataInputs}
                    updateInputs={updateInputs}
                    status={status}
                    calculating={calculating}
                    calc={calc}
                    classNameAdd={calcedOnce ? "" : "xl:col-start-2"}
                />
                <AppResult
                    calcedOnce={calcedOnce}
                    dataDamageLists={dataDamageLists}
                    dataDamageAnalysis={dataDamageAnalysis}
                    dataTaskMainDPS={dataTaskMainDPS}
                    dataCompareTasksDPS={dataCompareTasksDPS}
                    dataCompareTasksName={dataCompareTasksName}
                />
            </div>
        );
    }

    return (
        <div
            className="
                p-6 m-auto
                w-full md:w-4/5 lg:w-2/3 xl:w-full
                min-h-screen
                flex justify-center items-center"
        >
            {content}
        </div>
    );
};
