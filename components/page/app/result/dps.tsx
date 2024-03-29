"use client";
// my libraries
import { queryDps } from "@/components/actions";
import { Z_99, solveSampleSize } from "@/components/common";
import { ibrBase, ibrQueryDps } from "@/components/definitions";
import { AttributeBenefit, AttributeBenefitNotAvailable } from "./attribute-benefit";
// third party libraries
import { motion } from "framer-motion";
import { Card, CardBody, Progress, Tooltip } from "@nextui-org/react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { ComposedChart, Line, Area, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

const INTERVAL_COUNT_PER_SIDE = 32;
const RANGE_PER_SIDE = 0.01;
const COLOR_BAR = "#60C0D8";
const COLOR_LINE = "#DDDD80";

const DPSChart = ({ dps }: { dps: ibrQueryDps["data"] }) => {
    const interval = (dps.avg * RANGE_PER_SIDE) / INTERVAL_COUNT_PER_SIDE;
    const data = Array.from({ length: INTERVAL_COUNT_PER_SIDE * 2 + 1 }, (_, idx) => idx - INTERVAL_COUNT_PER_SIDE).map(
        (offset) => {
            const x = dps.avg + interval * offset;
            let e = interval * dps.current;
            if (dps.sd > 0) {
                e *=
                    (1 / (dps.sd * Math.sqrt(2 * Math.PI))) *
                    Math.exp(-Math.pow(x - dps.avg, 2) / (2 * Math.pow(dps.sd, 2)));
            }
            return { x, e, y: 0 };
        }
    );
    // 遍历 dps.list, 添加频次信息
    let ymax = 0;
    dps.list.forEach((x) => {
        const i = data.findIndex((d) => d.x >= x && (!(dps.sd > 0) || d.x - interval < x));
        if (i !== -1) {
            data[i].y += 1;
            if (data[i].y > ymax) {
                ymax = data[i].y;
            }
        }
    });
    ymax = Math.ceil(ymax / 10) * 10;
    const yticks = Array.from({ length: 11 }, (_, i) => (ymax / 10) * i);
    console.log(data);
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <XAxis dataKey="x" tickFormatter={(value) => Math.round(value).toString()} />
                <YAxis domain={[0, ymax]} ticks={yticks} width={ymax.toString().length * 10} />
                <Area type="step" dataKey="y" name="实际分布" fill={COLOR_BAR} stroke={COLOR_BAR} dot={false} />
                {dps.sd > 0 && <Line type="monotone" dataKey="e" name="标准正态" stroke={COLOR_LINE} dot={false} />}
                <Legend />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

const DPSResult = ({ avg, sd, ci, n }: { avg: number; sd: number; ci: number; n: number }) => {
    const ciAbsolute = ci.toFixed(ci > 100 ? 0 : ci > 10 ? 1 : 2);
    const ciPercent = ((ci / avg) * 100).toFixed(3) + "%";
    const tooltip = (
        <div className="flex flex-col gap-2">
            <MathJaxContext>
                <p>有 99% 的把握认为真实 DPS 位于该区间内.</p>
                <div>
                    <p>
                        置信区间 =<MathJax inline>{"\\( \\frac{\\sigma}{\\sqrt{n}} \\cdot Z\\)"}</MathJax>
                    </p>
                    <p>
                        <MathJax inline>{"\\(\\sigma\\)"}</MathJax> : 标准差. 当前为 {sd}.
                    </p>
                    <p>
                        <MathJax inline>{"\\(n\\)"}</MathJax> : 样本量. 当前为 {n}.
                    </p>
                    <p>
                        <MathJax inline>{"\\(Z\\)"}</MathJax> : Z分数.
                    </p>
                    <p>对于正态分布, 99% 置信度的 Z分数 为 {Z_99}.</p>
                </div>
            </MathJaxContext>
        </div>
    );
    return (
        <div className="basis-full flex flex-col justify-center items-center gap-4 sm:flex-row">
            <Card>
                <CardBody>
                    <p className="text-2xl">DPS: {avg}</p>
                </CardBody>
            </Card>
            <Tooltip showArrow={true} content={tooltip}>
                <Card>
                    <CardBody>
                        <p className="text-2xl">
                            置信区间: <span className="text-xl">±</span>
                            {ciAbsolute} / <span className="text-xl">±</span>
                            {ciPercent}
                        </p>
                    </CardBody>
                </Card>
            </Tooltip>
        </div>
    );
};

export const DPS = ({
    id,
    setID,
    setCalculating,
}: {
    id: string;
    setID: (value: string) => void;
    setCalculating: (value: boolean) => void;
}) => {
    // status 为 "init" 的逻辑处理位于 App 组件中, 若 status 为 "init", 则 DPS 组件不会被渲染
    const [dps, setDPS] = useState<ibrQueryDps["data"]>();
    const [n, setN] = useState(0);
    useEffect(() => {
        async function fetchData() {
            // id 为空的逻辑处理位于上层 useEffect 中, 若 id 为空, 则此函数不会被执行
            const response = (await queryDps(id)) as ibrBase;
            if (response.status === 0) {
                setDPS(response.data);
                if (response.data.complete) {
                    setID("");
                    setCalculating(false);
                    const ci = response.data.ci99;
                    if (ci / response.data.avg < 0.0005) {
                        setN(0);
                    } else {
                        setN(Math.ceil(solveSampleSize(response.data.avg * 0.0005, response.data.sd, Z_99)));
                    }
                    // setStatus 会更新 status 并因此触发 useEffect 的清理函数, 因此, 无需手动清理 idInterval
                }
            }
        }
        let idTimeout: NodeJS.Timeout | undefined;
        let idInterval: NodeJS.Timeout | undefined;
        if (id.length > 0) {
            idTimeout = setTimeout(async () => {
                await fetchData();
                idInterval = setInterval(fetchData, 1000);
            }, 500); // 定时函数. 500ms 后执行一次 fetchData, 并且每隔 1000ms 执行一次 fetchData.
        }
        return () => {
            if (idInterval) {
                clearInterval(idInterval);
            }
            if (idTimeout) {
                clearTimeout(idTimeout);
            }
        };
    }, [id, setID, setCalculating]);

    if (!dps) {
        return <></>;
    }

    return (
        <div className="basis-full flex flex-col justify-center items-center gap-4">
            <div className="w-full basis-full flex flex-col justify-center gap-8 2xl:flex-row">
                <motion.div layout className="basis-1/2 min-h-[30vh]">
                    <DPSChart dps={dps} />
                </motion.div>
                {id.length === 0 && (
                    <div className="basis-1/2 flex flex-col">
                        {n === 0 ? (
                            <AttributeBenefit dps={dps.avg} setCalculating={setCalculating} />
                        ) : (
                            <AttributeBenefitNotAvailable n={n} />
                        )}
                    </div>
                )}
            </div>
            <div className="w-full h-min flex flex-col justify-center items-center gap-4">
                <Progress aria-label="CalcDPS" value={(dps.current * 100) / dps.total} className="max-w-md" />
                <DPSResult avg={dps.avg} sd={dps.sd} ci={dps.ci99} n={dps.current} />
            </div>
        </div>
    );
};
