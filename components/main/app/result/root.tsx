"use client";

import { iResponseQueryDps } from "@/components/definitions";

import { Progress } from "@nextui-org/react";

import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    // Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
};

function Chart({ dps }: { dps: iResponseQueryDps["data"] | undefined }) {
    if (!dps) {
        return <></>;
    }
    const data = Array.from({ length: 61 }, (_, idx) => idx / 10 - 3).map((value) => {
        const x = dps.avg + value * dps.sd;
        const e =
            dps.sd *
            0.1 *
            dps.current *
            (1 / (dps.sd * Math.sqrt(2 * Math.PI))) *
            Math.exp(-Math.pow(x - dps.avg, 2) / (2 * Math.pow(dps.sd, 2)));
        return {
            x,
            e,
            y: 0,
        };
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
                <YAxis domain={[0, ymax]} ticks={yticks} />
                <Area type="step" dataKey="y" name="频次" fill="#60c0d8" stroke="#60c0d8" dot={false} />
                <Line type="monotone" dataKey="e" name="期望" stroke="#dddd80" dot={false} />
                <Legend />
                {/* <Tooltip
                    contentStyle={{
                        border: 0,
                        backgroundColor: "transparent",
                    }}
                    formatter={(value, name) => {
                        const n = Number(value);
                        if (!Number.isInteger(n)) {
                            return [n.toFixed(2), name];
                        }
                        return [value, name];
                    }}
                /> */}
            </ComposedChart>
        </ResponsiveContainer>
    );
}

export const Result = ({ dps }: { dps: iResponseQueryDps["data"] | undefined }) => {
    const p = dps ? (
        <Progress aria-label="计算中..." value={dps ? (dps.current * 100) / dps.total : 50} className="max-w-md" />
    ) : (
        <></>
    );
    return (
        <div className="flex flex-col justify-center items-center w-full h-full gap-8">
            <div className={dps ? "w-full h-full basis-5/6" : ""}>
                <Chart dps={dps} />
            </div>
            {p}
            <p className="text-2xl">{dps ? `平均DPS: ${dps.avg}` : "等待输入..."}</p>
        </div>
    );
};
