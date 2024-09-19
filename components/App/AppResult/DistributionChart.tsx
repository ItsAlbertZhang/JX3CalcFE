"use client";
// my libraries
import { TypeQueryDPS } from "@/components/definitions";
// third party libraries
import { ComposedChart, Line, Area, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
const error = console.error;
console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
};

const INTERVAL_COUNT_PER_SIDE = 32;
const RANGE_PER_SIDE = 0.01;
const COLOR_BAR = "#60C0D8";
const COLOR_LINE = "#DDDD80";

export const DistributeChart = ({ data }: { data: TypeQueryDPS["data"] }) => {
    const interval = (data.avg * RANGE_PER_SIDE) / INTERVAL_COUNT_PER_SIDE;
    const chart = Array.from(
        { length: INTERVAL_COUNT_PER_SIDE * 2 + 1 },
        (_, idx) => idx - INTERVAL_COUNT_PER_SIDE
    ).map((offset) => {
        const x = data.avg + interval * offset;
        let e = interval * data.current;
        if (data.sd > 0) {
            e *=
                (1 / (data.sd * Math.sqrt(2 * Math.PI))) *
                Math.exp(-Math.pow(x - data.avg, 2) / (2 * Math.pow(data.sd, 2)));
        }
        return { x, e, y: 0 };
    });
    // 遍历 dps.list, 添加频次信息
    let ymax = 0;
    data.list.forEach((x) => {
        const i = chart.findIndex((d) => d.x >= x && (!(data.sd > 0) || d.x - interval < x));
        if (i !== -1) {
            chart[i].y += 1;
            if (chart[i].y > ymax) {
                ymax = chart[i].y;
            }
        }
    });
    ymax = Math.ceil(ymax / 10) * 10;
    const yticks = Array.from({ length: 11 }, (_, i) => (ymax / 10) * i);
    return (
        <ResponsiveContainer>
            <ComposedChart data={chart}>
                <XAxis dataKey="x" tickFormatter={(value) => Math.round(value).toString()} />
                <YAxis domain={[0, ymax]} ticks={yticks} width={ymax.toString().length * 10 + 2} />
                <Area type="step" dataKey="y" name="实际分布" fill={COLOR_BAR} stroke={COLOR_BAR} dot={false} />
                {data.sd > 0 && <Line type="monotone" dataKey="e" name="标准正态" stroke={COLOR_LINE} dot={false} />}
                <Legend />
            </ComposedChart>
        </ResponsiveContainer>
    );
};
