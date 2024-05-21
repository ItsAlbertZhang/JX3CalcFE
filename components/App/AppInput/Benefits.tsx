"use client";
// child components simple
import { Effect, TypeOption } from "./Common";
// my libraries
import { DataInput } from "@/components/definitions";

export const Benefits = ({
    dataInputs,
    page,
    updateInputs,
    updateInput,
    setPage,
}: {
    dataInputs: DataInput[];
    page: number;
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    updateInput: (fn: (draft: DataInput) => void) => void;
    setPage: (page: number) => void;
}) => {
    const index = page - 1;
    interface Effects {
        [key: string]: {
            options: TypeOption[] | string[] | null;
            stacknum?: number;
            covrate?: number;
        };
    }
    const 物品增益: Effects = {
        "家园·酿造": {
            options: [
                { name: "女儿红·旬又三", color: "purple", tip: "急速", detail: "急速等级提高1144点" },
                { name: "状元红·旬又三", color: "purple", tip: "元气", detail: "元气提高256点" },
                { name: "女儿红", color: "blue", tip: "急速", detail: "急速等级提高286点" },
                { name: "状元红", color: "blue", tip: "元气", detail: "元气提高64点" },
            ],
        },
        "家园·烹饪": {
            options: [
                { name: "小炒青菜", color: "purple", tip: "内攻", detail: "内功攻击提高576点" },
                { name: "炸鱼干", color: "purple", tip: "会心", detail: "全会心提高1074点" },
                { name: "清蒸鲈鱼", color: "purple", tip: "破防", detail: "全破防提高1074点" },
                { name: "炖豆腐", color: "purple", tip: "无双", detail: "无双提高1074点" },
                { name: "煎豆腐", color: "purple", tip: "破招", detail: "破招提高1074点" },
            ],
        },
        辅助类食品: {
            options: [
                { name: "鱼片砂锅粥", color: "purple", tip: "元气", detail: "元气提高382点" },
                { name: "鱼头豆腐汤", color: "blue", tip: "元气", detail: "元气提高191点" },
            ],
        },
        增强类食品: {
            options: [
                { name: "灌汤包", color: "purple", tip: "内攻", detail: "内功攻击提高917点" },
                { name: "酸菜鱼", color: "purple", tip: "会心", detail: "全会心提高1705点" },
                { name: "红烧排骨", color: "purple", tip: "破防", detail: "全破防提高1705点" },
                { name: "白肉血肠", color: "purple", tip: "破招", detail: "破招提高1705点" },
                { name: "红烧扣肉", color: "purple", tip: "急速", detail: "急速值提高1705点" },
                { name: "鲜肉包子", color: "blue", tip: "内攻", detail: "内功攻击提高458点" },
                { name: "鱼香肉丝", color: "blue", tip: "会心", detail: "全会心提高853点" },
                { name: "水煮肉片", color: "blue", tip: "破防", detail: "全破防提高853点" },
                { name: "毛血旺", color: "blue", tip: "破招", detail: "破招提高853点" },
                { name: "栗子烧肉", color: "blue", tip: "急速", detail: "急速值提高853点" },
            ],
        },
        辅助类药品: {
            options: [
                { name: "上品聚魂丹", color: "purple", tip: "元气", detail: "元气提高492点" },
                { name: "中品聚魂丹", color: "blue", tip: "元气", detail: "元气提高246点" },
            ],
        },
        增强类药品: {
            options: [
                { name: "上品展凤散", color: "purple", tip: "内攻", detail: "内功攻击提高1179点" },
                { name: "上品玉璃散", color: "purple", tip: "会心", detail: "全会心提高2192点" },
                { name: "上品破秽散", color: "purple", tip: "破防", detail: "全破防提高2192点" },
                { name: "上品凝神散", color: "purple", tip: "破招", detail: "破招提高2192点" },
                { name: "上品活气散", color: "purple", tip: "急速", detail: "急速值提高2192点" },
                { name: "中品展凤散", color: "blue", tip: "内攻", detail: "内功攻击提高589点" },
                { name: "中品玉璃散", color: "blue", tip: "会心", detail: "全会心提高1096点" },
                { name: "中品破秽散", color: "blue", tip: "破防", detail: "全破防提高1096点" },
                { name: "中品凝神散", color: "blue", tip: "破招", detail: "破招提高1096点" },
                { name: "中品活气散", color: "blue", tip: "急速", detail: "急速值提高1096点" },
            ],
        },
        "武器·熔锭": {
            options: [
                { name: "断浪·坠宵熔锭（内攻）", color: "purple", detail: "内功攻击提升786点" },
                { name: "断浪·坠宵磨石（内攻）", color: "blue", detail: "内功攻击提升393点" },
            ],
        },
        宴席: {
            options: [
                {
                    name: "二十四桥明月夜",
                    color: "purple",
                    detail: "内功攻击提高524点\n全会心提高975点\n破招提高975点",
                },
            ],
        },
        同泽宴: {
            options: null,
        },
        蒸鱼菜盘: {
            options: null,
        },
        水煮鱼: {
            options: [
                { name: "百炼水煮鱼", color: "purple", detail: "无双增加400点\n破招增加400点" },
                { name: "炼狱水煮鱼", color: "purple", detail: "无双增加100点\n破招增加100点" },
            ],
        },
        吟冬卧雪: {
            options: null,
            stacknum: 8,
        },
    };
    const 团队增益: Effects = {
        目标易伤: {
            options: [
                { name: "秋肃", color: "default", detail: "受到的伤害提高6%，不可与同类效果叠加" },
                { name: "戒火", color: "default", detail: "受到的伤害提高2%" },
            ],
        },
        立地成佛: {
            options: null,
        },
        袖气: {
            options: null,
        },
        号令三军: {
            options: null,
            stacknum: 48,
        },
        弘法: {
            options: null,
            stacknum: 36,
            covrate: 0.5,
        },
        朝圣言: {
            options: [
                { name: "朝圣", color: "default" },
                { name: "圣浴明心", color: "default" },
            ],
            stacknum: 24,
            covrate: 0.05,
        },
        振奋: {
            options: null,
            stacknum: 125,
            covrate: 1.0,
        },
        左旋右转: {
            options: null,
            stacknum: 150,
            covrate: 1.0,
        },
        寒啸千军: {
            options: null,
            covrate: 0.5,
        },
        皎素: {
            options: null,
            covrate: 0.15,
        },
        仙王蛊鼎: {
            options: null,
            covrate: 0.21,
        },
        飘黄: {
            options: null,
            covrate: 0.125,
        },
        庄周梦: {
            options: null,
            stacknum: 200,
            covrate: 0.75,
        },
        配伍: {
            options: null,
            stacknum: 5,
            covrate: 1.0,
        },
    };
    const 小队增益: Effects = {
        破苍穹: {
            options: null,
            covrate: 1.0,
        },
        疏狂: {
            options: null,
            covrate: 1.0,
        },
    };
    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <div className="w-full grid xl:grid-cols-2 justify-items-center items-center gap-y-4">
                <div className="col-span-2">
                    <Effect
                        name="小队阵法"
                        dataInput={dataInputs[index]}
                        updateInput={updateInput}
                        options={["易筋经·天鼓雷音阵"]}
                        covrate={1.0}
                    />
                </div>
                {Object.keys(物品增益).map((name) => (
                    <Effect
                        key={"effect" + name}
                        name={name}
                        dataInput={dataInputs[index]}
                        updateInput={updateInput}
                        options={物品增益[name].options}
                        stacknum={物品增益[name].stacknum}
                        covrate={物品增益[name].covrate}
                    />
                ))}
                {Object.keys(团队增益).map((name) => (
                    <Effect
                        key={"effect" + name}
                        name={name}
                        dataInput={dataInputs[index]}
                        updateInput={updateInput}
                        options={团队增益[name].options}
                        stacknum={团队增益[name].stacknum}
                        covrate={团队增益[name].covrate}
                    />
                ))}
                {Object.keys(小队增益).map((name) => (
                    <Effect
                        key={"effect" + name}
                        name={name}
                        dataInput={dataInputs[index]}
                        updateInput={updateInput}
                        options={小队增益[name].options}
                        stacknum={小队增益[name].stacknum}
                        covrate={小队增益[name].covrate}
                    />
                ))}
            </div>
        </div>
    );
};
