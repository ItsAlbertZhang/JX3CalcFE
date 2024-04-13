"use client";
// my libraries
import { CustomBar } from "@/components/Common";
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
                    <Bar yAxisId="left" dataKey="proportion" fill={COLOR_BAR} shape={<CustomBar />} />
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
    const sorted = useMemo(() => [...data].sort(sortDA), [data]);
    const combined = useMemo(() => combineDA(data), [data]);

    return (
        <motion.div
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
            <div className="max-h-[35vh]">
                <DAChart damageAnalysis={combine ? combined : sorted} />
            </div>
        </motion.div>
    );
};
