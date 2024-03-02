"use client";
// my libraries
import { fetchGetJson } from "@/components/actions";
import { ibrBase, ibrQueryDamageList } from "@/components/definitions";
// third party libraries
import { Chip } from "@nextui-org/react";
import { Brush, LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

const INTERVAL = 3;
const COLOR = [
    "#ECC8AF",
    "#79B4A9",
    "#7EA3CC",
    "#AD8A64",
    "#F3C98B",
    "#B18FCF",
    "#8F5C38",
    "#FECEE9",
    "#84ACCE",
    "#6B9080",
];

interface Point {
    x: number;
    [key: string]: number;
}

const DLChart = ({ points }: { points: Point[] }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
                <Brush fill="#484848" height={15} />
                <XAxis dataKey="x" />
                <YAxis domain={["auto", "auto"]} />
                {points.map((point, index) => {
                    return (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={"y" + index}
                            stroke={COLOR[index % COLOR.length]}
                            strokeWidth={1.5}
                            dot={false}
                            // isAnimationActive={false}
                        />
                    );
                })}
            </LineChart>
        </ResponsiveContainer>
    );
};

async function queryDL(id: string) {
    return (await fetchGetJson({ port: 12897, path: `/query/${id}/damage-list` })) as ibrBase;
}

function addValue(point: Point, valueIndex: number, value: number) {
    point["y" + valueIndex] = value;
}

function calcPoint(dl: ibrQueryDamageList["data"]) {
    const result: Point[] = [];
    for (let i = 0; i < dl.length && i < 5; i++) {
        let idx = 0;
        let sum = 0;
        for (const damage of dl[i]) {
            if (damage.time < idx * INTERVAL + INTERVAL) {
                sum += damage.isCritical ? damage.damageCritical : damage.damageBase;
            } else {
                if (result.length <= idx) {
                    result.push({ x: idx * INTERVAL + INTERVAL });
                }
                addValue(result[idx], i, sum / result[idx].x);
                idx++;
            }
        }
    }
    return result;
}

export const DamageList = ({ status }: { status: string }) => {
    // status 为 "init" 的逻辑处理位于 App 组件中, 若 status 为 "init", 则 DPS 组件不会被渲染
    const [dl, setDL] = useState<ibrQueryDamageList["data"]>();
    useEffect(() => {
        async function fetchData() {
            // status 为 "waiting" 的逻辑处理位于上层 useEffect 中, 若 status 为 "waiting", 则此函数不会被执行
            const response = await queryDL(status);
            if (response.status === 0) {
                const data = response.data as ibrQueryDamageList["data"];
                setDL(data);
            } else {
                setTimeout(() => {
                    fetchData();
                }, 1500);
            }
        }
        const idTimeout = setTimeout(() => {
            fetchData();
        }, 500);
        return () => {
            clearTimeout(idTimeout);
        };
    }, [status]);

    if (!dl) {
        return <></>;
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-full gap-2">
            <div className="flex flex-col justify-center items-center w-full h-min gap-4">
                <Chip size="lg" radius="sm">
                    DPS - 时间曲线
                </Chip>
            </div>
            <div className="w-full h-full min-h-[30vh]">
                <DLChart points={calcPoint(dl)} />
            </div>
        </div>
    );
};
