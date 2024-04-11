"use client";
// my libraries
import { fetchGetJson } from "@/components/actions";
import { ibrBase, ibrQueryDamageList } from "@/components/definitions";
// third party libraries
import { Chip, Slider, SliderValue } from "@nextui-org/react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

const SLIDEBAR_STEP = 1;
const POINT_COUNT = 100;
const POINT_RAW_INTERVAL = 1;
const LINE_COUNT = 5;
const LINE_COLOR = [
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
                <XAxis dataKey="x" />
                <YAxis domain={["auto", "auto"]} />
                {points.map((point, index) => {
                    return (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={"y" + index}
                            stroke={LINE_COLOR[index % LINE_COLOR.length]}
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

function pointsCalc(dl: ibrQueryDamageList["data"]) {
    const result: Point[] = [];
    for (let i = 0; i < dl.length && i < LINE_COUNT; i++) {
        let idx = 0;
        let sumDamage = 0;
        for (const damage of dl[i]) {
            const resultAvailable = result.length > idx;
            const intervalMax = resultAvailable ? result[idx].x : idx * POINT_RAW_INTERVAL + POINT_RAW_INTERVAL;
            if (damage.time > intervalMax) {
                // 当前区间计算完毕, 处理区间
                if (!resultAvailable) {
                    result.push({ x: intervalMax });
                }
                addValue(result[idx], i, sumDamage / intervalMax);
                idx++;
            }
            sumDamage += damage.isCritical ? damage.damageCritical : damage.damageBase; // 做 sum 计算
        }
    }
    return result;
}

function pointsFilter(points: Point[], range: number[]) {
    let result = points;
    result = result.filter((value) => Object.keys(value).length == LINE_COUNT + 1);
    result = result.filter((value) => value.x >= range[0] && value.x <= range[1]);
    result = result.filter(
        (_, index) => index % Math.ceil(result.length / POINT_COUNT) === 0 || index === result.length - 1
    );
    return result;
}

export const DamageList = ({ id }: { id: string }) => {
    // status 为 "init" 的逻辑处理位于 App 组件中, 若 status 为 "init", 则 DPS 组件不会被渲染
    const [dl, setDL] = useState<ibrQueryDamageList["data"]>();
    const [points, setPoints] = useState<Point[]>([]);
    const [sliderMax, setSliderMax] = useState<number>(0);
    const [sliderValue, setSliderValue] = useState<SliderValue>([0, 0]);

    useEffect(() => {
        function getMaxValue(data: ibrQueryDamageList["data"]) {
            let max = 0;
            for (const fight of data) {
                for (const damage of fight) {
                    if (damage.time > max) {
                        max = damage.time;
                    }
                }
            }
            return max;
        }
        async function fetchData() {
            // id 为 undefined 的逻辑处理位于 App 组件中, 若 id 为 undefined, 则 DPS 组件不会被渲染
            const response = await queryDL(id);
            if (response.status === 0) {
                const data = response.data as ibrQueryDamageList["data"];
                const max = getMaxValue(data);
                setSliderMax(max);
                setSliderValue([0, max]);
                setDL(data);
                setPoints(pointsCalc(data));
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

    if (!dl) {
        return <div className="basis-full"></div>;
    }

    return (
        <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="w-full h-min flex flex-col justify-center items-center gap-4">
                <Chip size="lg" radius="sm">
                    DPS - 时间曲线
                </Chip>
                <Slider
                    label="查看范围"
                    color="foreground"
                    step={SLIDEBAR_STEP}
                    minValue={0}
                    maxValue={sliderMax}
                    value={sliderValue}
                    onChange={(valueRaw) => {
                        const value = valueRaw as number[];
                        if (value[1] - value[0] >= 10) {
                            setSliderValue(value);
                        }
                    }}
                />
            </div>
            <div className="grow">
                <DLChart points={pointsFilter(points, sliderValue as number[])} />
            </div>
        </motion.div>
    );
};
