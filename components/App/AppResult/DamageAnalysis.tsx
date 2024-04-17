"use client";
// child components simple
import { HorizontalRoundedBar } from "./Common";
// my libraries
import { TypeQueryDamageAnalysis } from "@/components/definitions";
// third party libraries
import { Chip, ScrollShadow, Switch } from "@nextui-org/react";
import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useMemo, useState } from "react";

const BAR_SIZE = 30;
const COLOR_BAR = "#964824";
const COLOR_TEXT = "#DDDDDD";

const DAChart = ({ damageAnalysis }: { damageAnalysis: TypeQueryDamageAnalysis["data"] }) => {
    return (
        <ScrollShadow hideScrollBar className="h-full">
            <ResponsiveContainer width="100%" height={damageAnalysis.length * BAR_SIZE}>
                <BarChart layout="vertical" data={damageAnalysis}>
                    <Bar yAxisId="left" dataKey="proportion" fill={COLOR_BAR} shape={<HorizontalRoundedBar />} />
                    <XAxis type="number" hide domain={[0, damageAnalysis[0].proportion * 1.25]} />
                    <YAxis
                        yAxisId="left"
                        type="category"
                        mirror
                        axisLine={false}
                        tickLine={false}
                        dataKey="name"
                        interval={0}
                        tick={{ fontSize: BAR_SIZE / 2, fill: COLOR_TEXT }}
                    />
                    <YAxis
                        yAxisId="right"
                        type="category"
                        mirror
                        axisLine={false}
                        tickLine={false}
                        orientation="right"
                        dataKey="proportion"
                        interval={0}
                        tick={{ fontSize: BAR_SIZE / 2, fill: COLOR_TEXT }}
                        tickFormatter={(value: number) => (value * 100).toFixed(2) + "%"}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ScrollShadow>
    );
};

function sortDA(a: TypeQueryDamageAnalysis["data"][0], b: TypeQueryDamageAnalysis["data"][0]) {
    return b.proportion - a.proportion; // 升序排序
}

function combineDA(data: TypeQueryDamageAnalysis["data"]) {
    const result: TypeQueryDamageAnalysis["data"] = [];
    data.forEach((item) => {
        const index = result.findIndex((element) => element.name === item.name);
        if (index === -1) {
            result.push({ ...item });
        } else {
            result[index].proportion += item.proportion;
            result[index].damageMax = Math.max(result[index].damageMax, item.damageMax);
            result[index].damageMin = Math.min(result[index].damageMin, item.damageMin);
        }
    });
    return result.sort(sortDA);
}

export const DamageAnalysis = ({ data }: { data: TypeQueryDamageAnalysis["data"] }) => {
    const [combine, setCombine] = useState(false);
    const dataSorted = useMemo(() => [...data].sort(sortDA), [data]);
    const dataCombined = useMemo(() => combineDA(data), [data]);

    return (
        <motion.div
            style={{ maxHeight: "calc((100vh - 1.5rem * 2 - 1rem * 2 - 1rem) * 4 / 9)" }}
            // 1.5rem: p-6, 1rem: gap-4
            // see https://tailwindcss.com/docs
            className="flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="w-full h-min flex justify-between items-center px-4">
                <Chip>技能</Chip>
                <Switch isSelected={combine} onValueChange={setCombine} size="sm">
                    合并同名技能
                </Switch>
                <Chip>占比</Chip>
            </div>
            <DAChart damageAnalysis={combine ? dataCombined : dataSorted} />
        </motion.div>
    );
};
