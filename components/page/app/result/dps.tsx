"use client";
// my libraries
import { ibrBase, ibrQueryDps } from "@/components/definitions";
// third party libraries
import { Card, CardBody, Progress } from "@nextui-org/react";
import { ComposedChart, Line, Area, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const COLOR_LIGHT = "#60C0D8";
const COLOR_DARK = "#DDDD80";

const DPSChart = ({ dps }: { dps: ibrQueryDps["data"] }) => {
    const data = Array.from({ length: 61 }, (_, idx) => idx / 10 - 3).map((value) => {
        const x = dps.avg + value * dps.sd;
        let e = dps.sd * 0.1 * dps.current;
        e *= (1 / (dps.sd * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - dps.avg, 2) / (2 * Math.pow(dps.sd, 2)));
        return { x, e, y: 0 };
    });
    // 遍历 dps.list, 添加频次信息
    let ymax = 0;
    dps.list.forEach((x) => {
        const i = data.findIndex((d) => d.x >= x && d.x - 0.1 * dps.sd < x);
        if (i !== -1) {
            data[i].y += 1;
            if (data[i].y > ymax) {
                ymax = data[i].y;
            }
        }
    });
    ymax = Math.ceil(ymax / 10) * 10;
    const yticks = Array.from({ length: 11 }, (_, i) => (ymax / 10) * i);
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <XAxis dataKey="x" tickFormatter={(value) => Math.round(value).toString()} />
                <YAxis domain={[0, ymax]} ticks={yticks} width={ymax.toString().length * 10} />
                <Area type="step" dataKey="y" name="实际分布" fill={COLOR_LIGHT} stroke={COLOR_LIGHT} dot={false} />
                <Line type="monotone" dataKey="e" name="标准正态" stroke={COLOR_DARK} dot={false} />
                <Legend />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

async function queryDps(id: string) {
    const response = await fetch(`http://${window.location.hostname}:12897/query/${id}/dps`);
    const data = await response.json();
    return data as ibrBase;
}

export const DPS = ({ status, setStatus }: { status: string; setStatus: (value: string) => void }) => {
    // status 为 "init" 的逻辑处理位于 App 组件中, 若 status 为 "init", 则 DPS 组件不会被渲染
    const [dps, setDPS] = useState<ibrQueryDps["data"]>();
    useEffect(() => {
        async function fetchData() {
            // status 为 "waiting" 的逻辑处理位于上层 useEffect 中, 若 status 为 "waiting", 则此函数不会被执行
            const response = await queryDps(status);
            if (response.status === 0) {
                setDPS(response.data);
                if (response.data.complete) {
                    setStatus("waiting");
                    // setStatus 会更新 status 并因此触发 useEffect 的清理函数, 因此, 无需手动清理 idInterval
                }
            }
        }
        let idTimeout: NodeJS.Timeout | undefined;
        let idInterval: NodeJS.Timeout | undefined;
        if (status !== "waiting") {
            idTimeout = setTimeout(async () => {
                await fetchData();
                idInterval = setInterval(fetchData, 1000);
            }, 500);
        }
        return () => {
            if (idInterval) {
                clearInterval(idInterval);
            }
            if (idTimeout) {
                clearTimeout(idTimeout);
            }
        };
    }, [status, setStatus]);

    if (!dps) {
        return <></>;
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-full gap-4">
            <div className="w-full h-full min-h-[30vh]">
                <DPSChart dps={dps} />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-min gap-4">
                <Progress aria-label="计算中..." value={(dps.current * 100) / dps.total} className="max-w-md" />
                <Card>
                    <CardBody>
                        <p className="text-2xl">平均DPS: {dps.avg}</p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
