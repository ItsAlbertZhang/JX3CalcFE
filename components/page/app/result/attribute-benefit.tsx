"use client";
// my libraries
import { createTask, queryDps } from "@/components/actions";
import { CustomBar } from "@/components/common";
import { ContextUserinputLatest } from "@/components/context";
import { ClsUserinput, ibrQueryDps, ibrString } from "@/components/definitions";
// third party libraries
import { Button, Card, CardBody, Chip, Progress, Spacer, Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, ErrorBar } from "recharts";
import { useContext, useState } from "react";

export const AttributeBenefitNotAvailable = ({ n }: { n: number }) => {
    return (
        <motion.div
            className="basis-full flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <Card>
                <CardBody>
                    <p className="text-xl">置信区间精度高于0.05%方可计算属性收益.</p>
                    <Spacer y={2} />
                    <p>可采取以下手段获取更精确的置信区间:</p>
                    <Spacer y={2} />
                    <p>1. 降低输入属性中的随机量.</p>
                    <p>如: 减少计算随机事件, 降低按键延迟.</p>
                    <Spacer y={2} />
                    <p>2. 增加计算次数.</p>
                    <p>所需计算次数约为 {n} 次以上.</p>
                    <p>(由本次计算结果反解置信区间方程求出.)</p>
                </CardBody>
            </Card>
        </motion.div>
    );
};

interface ABRes {
    name: string;
    dps: number;
    addpercent: number;
    onesideCIpercent: number;
}

const ADD_BASE = 198;
const ADD_MAGIC_ATTACK = 475;
const ADD_CRITICAL = 883;
const ADD_CRITICAL_DAMAGE = 883;
const ADD_OVERCOME = 883;
const ADD_STRAIN = 883;
const ADD_SURPLUS = 883;
const ATTRS = ["基础", "攻击", "会心", "会效", "破防", "无双", "破招"];

const getNewUserinput = (userinput: ClsUserinput, attr: string) => {
    switch (attr) {
        case "基础":
            return {
                ...userinput,
                attribute: {
                    ...userinput.attribute,
                    data: {
                        ...userinput.attribute.data,
                        Spunk: userinput.attribute.data.Spunk + ADD_BASE,
                    },
                },
            };
            break;
        case "攻击":
            return {
                ...userinput,
                attribute: {
                    ...userinput.attribute,
                    data: {
                        ...userinput.attribute.data,
                        SolarAttackPowerBase: userinput.attribute.data.SolarAttackPowerBase + ADD_MAGIC_ATTACK,
                        LunarAttackPowerBase: userinput.attribute.data.LunarAttackPowerBase + ADD_MAGIC_ATTACK,
                        NeutralAttackPowerBase: userinput.attribute.data.NeutralAttackPowerBase + ADD_MAGIC_ATTACK,
                        PoisonAttackPowerBase: userinput.attribute.data.PoisonAttackPowerBase + ADD_MAGIC_ATTACK,
                    },
                },
            };
            break;
        case "会心":
            return {
                ...userinput,
                attribute: {
                    ...userinput.attribute,
                    data: {
                        ...userinput.attribute.data,
                        PhysicsCriticalStrike: userinput.attribute.data.PhysicsCriticalStrike + ADD_CRITICAL,
                        SolarCriticalStrike: userinput.attribute.data.SolarCriticalStrike + ADD_CRITICAL,
                        LunarCriticalStrike: userinput.attribute.data.LunarCriticalStrike + ADD_CRITICAL,
                        NeutralCriticalStrike: userinput.attribute.data.NeutralCriticalStrike + ADD_CRITICAL,
                        PoisonCriticalStrike: userinput.attribute.data.PoisonCriticalStrike + ADD_CRITICAL,
                    },
                },
            };
            break;
        case "会效":
            return {
                ...userinput,
                attribute: {
                    ...userinput.attribute,
                    data: {
                        ...userinput.attribute.data,
                        PhysicsCriticalDamagePower:
                            userinput.attribute.data.PhysicsCriticalDamagePower + ADD_CRITICAL_DAMAGE,
                        SolarCriticalDamagePower:
                            userinput.attribute.data.SolarCriticalDamagePower + ADD_CRITICAL_DAMAGE,
                        LunarCriticalDamagePower:
                            userinput.attribute.data.LunarCriticalDamagePower + ADD_CRITICAL_DAMAGE,
                        NeutralCriticalDamagePower:
                            userinput.attribute.data.NeutralCriticalDamagePower + ADD_CRITICAL_DAMAGE,
                        PoisonCriticalDamagePower:
                            userinput.attribute.data.PoisonCriticalDamagePower + ADD_CRITICAL_DAMAGE,
                    },
                },
            };
            break;
        case "破防":
            return {
                ...userinput,
                attribute: {
                    ...userinput.attribute,
                    data: {
                        ...userinput.attribute.data,
                        PhysicsOvercomeBase: userinput.attribute.data.PhysicsOvercomeBase + ADD_OVERCOME,
                        SolarOvercomeBase: userinput.attribute.data.SolarOvercomeBase + ADD_OVERCOME,
                        LunarOvercomeBase: userinput.attribute.data.LunarOvercomeBase + ADD_OVERCOME,
                        NeutralOvercomeBase: userinput.attribute.data.NeutralOvercomeBase + ADD_OVERCOME,
                        PoisonOvercomeBase: userinput.attribute.data.PoisonOvercomeBase + ADD_OVERCOME,
                    },
                },
            };
            break;
        case "无双":
            return {
                ...userinput,
                attribute: {
                    ...userinput.attribute,
                    data: {
                        ...userinput.attribute.data,
                        Strain: userinput.attribute.data.Strain + ADD_STRAIN,
                    },
                },
            };
            break;
        case "破招":
            return {
                ...userinput,
                attribute: {
                    ...userinput.attribute,
                    data: {
                        ...userinput.attribute.data,
                        SurplusValue: userinput.attribute.data.SurplusValue + ADD_SURPLUS,
                    },
                },
            };
            break;
        default:
            return userinput;
            break;
    }
};

const COLOR_BAR = "#337755";
const COLOR_ERROR = "#CC0000";
const COLOR_TEXT = "#DDDDDD";

const ABChart = ({ res }: { res: ABRes[] }) => {
    let xMax = 0;
    res.forEach((x) => {
        const value = (x.addpercent + x.onesideCIpercent) * 1.25;
        if (value > xMax) {
            xMax = value;
        }
    });
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={res}>
                <Bar yAxisId="left" dataKey="addpercent" fill={COLOR_BAR} shape={<CustomBar />}>
                    <ErrorBar dataKey="onesideCIpercent" stroke={COLOR_ERROR} />
                </Bar>
                <XAxis type="number" hide domain={[0, xMax]} />
                <YAxis
                    yAxisId="left"
                    type="category"
                    mirror
                    axisLine={false}
                    tickLine={false}
                    dataKey="name"
                    interval={0}
                    tick={{ fill: COLOR_TEXT }}
                />
                <YAxis
                    yAxisId="right"
                    type="category"
                    mirror
                    axisLine={false}
                    tickLine={false}
                    orientation="right"
                    dataKey="addpercent"
                    interval={0}
                    tick={{ fill: COLOR_TEXT }}
                    tickFormatter={(value: number) => (value * 100).toFixed(2) + "%"}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export const AttributeBenefit = ({
    dps,
    setCalculating,
}: {
    dps: number;
    setCalculating: (value: boolean) => void;
}) => {
    const userinput = useContext(ContextUserinputLatest).value;
    const [stat, setStat] = useState<"waiting" | "calculating" | "done">("waiting");
    const [progress, setProgress] = useState(0);
    const [res, setRes] = useState<ABRes[]>(
        ATTRS.map((value) => ({ name: value, dps: 0, addpercent: 0, onesideCIpercent: 0 }))
    );

    async function calc() {
        for (let i = 0; i < ATTRS.length; i++) {
            const attr = ATTRS[i];
            const newuserinput = getNewUserinput(userinput, attr);
            const response = (await createTask(newuserinput)) as ibrString;
            if (response.status === 0) {
                const id = response.data;
                let complete = false;
                while (!complete) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    const response = (await queryDps(id)) as ibrQueryDps;
                    if (response.status === 0) {
                        if (response.data.complete) {
                            complete = true;
                            const data = response.data;
                            const newValue = {
                                name: attr,
                                dps: data.avg,
                                addpercent: (data.avg - dps) / dps,
                                onesideCIpercent: data.ci99 / dps,
                            };
                            setRes((prevRes) => prevRes.map((item, index) => (index === i ? newValue : item)));
                        }
                        setProgress((response.data.current / response.data.total) * 100);
                    }
                }
            }
        }
        setStat("done");
        setCalculating(false);
    }

    let title: JSX.Element;
    if (stat === "waiting") {
        title = (
            <Button size="lg" color="success">
                属性收益可用
            </Button>
        );
    } else {
        const tooltip = (
            <div className="flex flex-col">
                <p>基于1单位属性容量(一个小附魔)计算得出.</p>
                <p>右侧数值为1单位相应属性带来的DPS提升百分比.</p>
                <p>红色标识范围为该结果的99%置信区间.</p>
            </div>
        );
        title = (
            <Tooltip showArrow={true} content={tooltip} placement="bottom">
                <Chip size="lg" radius="sm">
                    属性收益
                </Chip>
            </Tooltip>
        );
    }

    let subtitle: JSX.Element;
    if (stat === "waiting") {
        subtitle = (
            <Button
                onPress={(value) => {
                    setStat("calculating");
                    setCalculating(true);
                    calc();
                }}
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            >
                计算
            </Button>
        );
    } else {
        subtitle = (
            <Progress
                aria-label="CalcAB"
                size="sm"
                value={progress}
                classNames={{
                    base: "max-w-md",
                    track: "drop-shadow-md border border-default",
                    indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                    label: "tracking-wider font-medium text-default-600",
                    value: "text-foreground/60",
                }}
            />
        );
    }

    let content: JSX.Element = <></>;
    if (stat !== "waiting") {
        if (res.length > 0) {
            content = <ABChart res={res} />;
        }
        content = <div className="w-full basis-full min-h-[30vh] 2xl:min-h-[20vh]">{content}</div>;
    }

    return (
        <motion.div
            className="basis-full flex flex-col justify-center items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div layout className="w-full h-min flex justify-center items-center">
                {title}
            </motion.div>
            {stat === "waiting" && <Spacer y={2} />}
            {subtitle}
            {content}
        </motion.div>
    );
};
