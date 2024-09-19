"use client";
// child components simple
import { HorizontalEndRoundedBar } from "./Common";
// my libraries
import { DataInput, TypeQueryDPS } from "@/components/definitions";
// third party libraries
import { BarChart, Bar, ErrorBar, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";

const COLOR_BAR = "#337755";
const COLOR_ERROR = "#CC0000";
const COLOR_TEXT = "#DDDDDD";

function countCharacters(str: string) {
    const asciiMatches = str.match(/[\x00-\x7F]/g) || [];
    const utfMatches = str.match(/[^\x00-\x7F]/g) || [];
    return asciiMatches.length + utfMatches.length * 2;
}

export const TaskCompare = ({
    dataTaskMainDPS,
    dataCompareTasksDPS,
    dataCompareTasksName,
}: {
    dataTaskMainDPS: TypeQueryDPS["data"];
    dataCompareTasksDPS: TypeQueryDPS["data"][];
    dataCompareTasksName: string[];
}) => {
    const data = dataCompareTasksDPS.map((data, i) => ({
        add: (data.avg - dataTaskMainDPS.avg) / dataTaskMainDPS.avg,
        ci: data.ci99 / data.avg,
        name: dataCompareTasksName[i],
        // name: `第 ${i} 页`,
    }));
    let xmin = 0;
    let xmax = 0;
    let characters = 0;
    data.forEach((item) => {
        if (item.add - item.ci < xmin) xmin = item.add - item.ci;
        if (item.add + item.ci > xmax) xmax = item.add + item.ci;
        const c = countCharacters(item.name);
        if (c > characters) characters = c;
    });
    return (
        // <div>
        //     <p>{dataTaskMainDPS.avg}</p>
        //     {dataCompareTasksDPS.map((data, i) => (
        //         <p key={i}>{data.avg}</p>
        //     ))}
        // </div>
        <ResponsiveContainer width="100%" height={Math.min(100, (100 / 8) * data.length).toFixed(1) + "%"}>
            <BarChart layout="vertical" data={data}>
                <Bar yAxisId="left" dataKey="add" fill={COLOR_BAR} shape={<HorizontalEndRoundedBar />}>
                    <ErrorBar dataKey="ci" stroke={COLOR_ERROR} />
                </Bar>
                <XAxis type="number" hide domain={[xmin, xmax]} />
                <YAxis
                    yAxisId="left"
                    type="category"
                    // mirror
                    width={characters * 10 + 1}
                    axisLine={false}
                    tickLine={false}
                    dataKey="name"
                    interval={0}
                    tick={{ fill: COLOR_TEXT }}
                />
                <YAxis
                    yAxisId="right"
                    type="category"
                    // mirror
                    width={60}
                    axisLine={false}
                    tickLine={false}
                    orientation="right"
                    dataKey="add"
                    interval={0}
                    tick={{ fill: COLOR_TEXT }}
                    tickFormatter={(value: number) =>
                        (value >= 0 ? "+" : "") +
                        (Math.abs(value) >= 0.1 ? (value * 100).toFixed(1) : (value * 100).toFixed(2)) +
                        "%"
                    }
                />
                <ReferenceLine yAxisId="right" x={0} stroke={COLOR_BAR} />
            </BarChart>
        </ResponsiveContainer>
    );
};
