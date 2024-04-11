"use client";
// my libraries
import { fetchGetJson } from "@/components/actions";
import { CustomBar } from "@/components/common";
import { ibrBase, ibrQueryDamageAnalysis } from "@/components/definitions";
// third party libraries
import { Chip, ScrollShadow, Switch } from "@nextui-org/react";
import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

const BAR_SIZE = 30;
const COLOR_BAR = "#964824";
const COLOR_TEXT = "#DDDDDD";

const DAChart = ({ damageAnalysis }: { damageAnalysis: ibrQueryDamageAnalysis["data"] }) => {
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

async function queryDA(id: string) {
    return (await fetchGetJson({ port: 12897, path: `/query/${id}/damage-analysis` })) as ibrBase;
}

function sortDA(a: ibrQueryDamageAnalysis["data"][0], b: ibrQueryDamageAnalysis["data"][0]) {
    return b.proportion - a.proportion; // 升序排序
}

function combineDA(data: ibrQueryDamageAnalysis["data"]) {
    const result: ibrQueryDamageAnalysis["data"] = [];
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

export const DamageAnalysis = ({ id }: { id: string }) => {
    // id 为 undefined 的逻辑处理位于 App 组件中, 若 id 为 undefined, 则 DPS 组件不会被渲染
    const [da, setDA] = useState<ibrQueryDamageAnalysis["data"]>();
    const [combine, setCombine] = useState(false);
    useEffect(() => {
        async function fetchData() {
            // id 为空的逻辑处理位于上层 useEffect 中, 若 id 为空, 则此函数不会被执行
            const response = await queryDA(id);
            if (response.status === 0) {
                const data = response.data as ibrQueryDamageAnalysis["data"];
                data.sort(sortDA);
                setDA(data);
            } else {
                setTimeout(() => {
                    fetchData();
                }, 500);
            }
        }
        let idTimeout: NodeJS.Timeout | undefined;
        if (id.length > 0) {
            idTimeout = setTimeout(() => {
                fetchData();
            }, 500); // 定时函数. 500ms 后执行一次 fetchData. 如果失败, fetchData 函数内部会每隔 500ms 再次重试.
        }
        return () => {
            if (idTimeout) {
                clearTimeout(idTimeout);
            }
        };
    }, [id]);

    if (!da) {
        return <div className="basis-full"></div>;
    }

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
                <DAChart damageAnalysis={combine ? combineDA(da) : da} />
            </div>
        </motion.div>
    );
};
