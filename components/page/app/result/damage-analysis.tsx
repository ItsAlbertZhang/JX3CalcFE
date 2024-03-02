"use client";
// my libraries
import { fetchGetJson } from "@/components/actions";
import { ibrBase, ibrQueryDamageAnalysis } from "@/components/definitions";
// third party libraries
import { Chip, ScrollShadow, Switch } from "@nextui-org/react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

const BAR_SIZE = 30;
const COLOR_DARK = "#8F6363";
const COLOR_LIGHT = "#DDDDDD";

const DAChart = ({ damageAnalysis }: { damageAnalysis: ibrQueryDamageAnalysis["data"] }) => {
    return (
        <ScrollShadow hideScrollBar className="w-full h-full">
            <ResponsiveContainer width="100%" height={damageAnalysis.length * BAR_SIZE}>
                <BarChart layout="vertical" data={damageAnalysis}>
                    <Bar yAxisId="left" dataKey="proportion" fill={COLOR_DARK} />
                    <XAxis type="number" hide domain={[0, damageAnalysis[0].proportion * 1.2]} />
                    <YAxis
                        yAxisId="left"
                        type="category"
                        mirror
                        axisLine={false}
                        tickLine={false}
                        dataKey="name"
                        tick={{ fontSize: BAR_SIZE / 2, fill: COLOR_LIGHT }}
                    />
                    <YAxis
                        yAxisId="right"
                        type="category"
                        mirror
                        axisLine={false}
                        tickLine={false}
                        orientation="right"
                        dataKey="proportion"
                        tick={{ fontSize: BAR_SIZE / 2, fill: COLOR_LIGHT }}
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

export const DamageAnalysis = ({ status }: { status: string }) => {
    // status 为 "init" 的逻辑处理位于 App 组件中, 若 status 为 "init", 则 DPS 组件不会被渲染
    const [da, setDA] = useState<ibrQueryDamageAnalysis["data"]>();
    const [combine, setCombine] = useState(false);
    useEffect(() => {
        async function fetchData() {
            // status 为 "waiting" 的逻辑处理位于上层 useEffect 中, 若 status 为 "waiting", 则此函数不会被执行
            const response = await queryDA(status);
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
        if (status !== "waiting") {
            idTimeout = setTimeout(() => {
                fetchData();
            }, 500);
        }
        return () => {
            if (idTimeout) {
                clearTimeout(idTimeout);
            }
        };
    }, [status]);

    if (!da) {
        return <></>;
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-full gap-2">
            <div className="flex justify-between items-center w-full h-min px-4">
                <Chip>技能</Chip>
                <Switch isSelected={combine} onValueChange={setCombine} size="sm">
                    合并同名技能
                </Switch>
                <Chip>占比</Chip>
            </div>
            <div className="w-full h-full min-h-[30vh] max-h-[50vh]">
                <DAChart damageAnalysis={combine ? combineDA(da) : da} />
            </div>
        </div>
    );
};
