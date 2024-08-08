"use client";
// child components simple
import { Effect, EffectCovrate, TypeOption } from "./Common";
// my libraries
import { DataEffect, DataInput } from "@/components/definitions";
// thrid party libraries
import {
    Accordion,
    AccordionItem,
    Checkbox,
    Image,
    ScrollShadow,
    Select,
    SelectItem,
    SelectSection,
    SelectedItems,
    Spacer,
} from "@nextui-org/react";

interface Form {
    kungfu: string;
    name: string;
    iconKungfu: number;
    iconFormation: number;
    detail: string;
}
interface Effects {
    [key: string]: {
        options: TypeOption[] | string[] | null;
        stacknum?: number;
        covrate?: number;
        detail?: string;
    };
}

const formationTab: { [key: string]: Form } = {
    Compare: {
        kungfu: "",
        name: "",
        iconKungfu: 0,
        iconFormation: 0,
        detail: "",
    },
    "易筋经·天鼓雷音阵": {
        kungfu: "易筋经",
        name: "天鼓雷音阵",
        iconKungfu: 425,
        iconFormation: 1802,
        detail: "内功基础攻击力提高5%\n无双提高2%\n内功基础破防提高10%\n内功基础攻击力提高2%，最多叠加5层",
    },
    "花间游·七绝逍遥阵": {
        kungfu: "花间游",
        name: "七绝逍遥阵",
        iconKungfu: 406,
        iconFormation: 1806,
        detail: "内功基础攻击力提高5%\n内功基础破防值提高10%\n内功基础攻击力提高2%，最多叠加5层",
    },
    "紫霞功·九宫八卦阵": {
        kungfu: "紫霞功",
        name: "九宫八卦阵",
        iconKungfu: 627,
        iconFormation: 1797,
        detail: "内功会心几率提高3%\n无双提高2%\n内功会心效果提高15%\n内功会心几率提高1%，最多叠加五层",
    },
    "毒经·万蛊噬心阵": {
        kungfu: "毒经",
        name: "万蛊噬心阵",
        iconKungfu: 2766,
        iconFormation: 2714,
        detail: "内功基础攻击力提高5%\n内功会心几率提高3%\n内功会心效果提高10%\n内功破防提高10%，持续5秒",
    },
    "天罗诡道·千机百变阵": {
        kungfu: "天罗诡道",
        name: "千机百变阵",
        iconKungfu: 3184,
        iconFormation: 3152,
        detail: "内功基础攻击力提高5%\n无双提高2%\n内功基础破防提高10%\n内功基础攻击力提高2%，最多叠加5层",
    },
    "莫问·万籁金弦阵": {
        kungfu: "莫问",
        name: "万籁金弦阵",
        iconKungfu: 7071,
        iconFormation: 7047,
        detail: "内功会心几率提高3%\n无双提高2%\n内功基础攻击力提高10%\n内功会心几率提高5%，持续5秒",
    },
    "山海心诀·苍梧引灵阵": {
        kungfu: "山海心诀",
        name: "苍梧引灵阵",
        iconKungfu: 19664,
        iconFormation: 20426,
        detail: "全会心提高3%\n无双提高2%\n造成伤害提高6%\n会心效果提高15%，持续6秒",
    },
    "无界端·无界行侠阵": {
        kungfu: "无界端",
        name: "无界行侠阵",
        iconKungfu: 13,
        iconFormation: 22210,
        detail: "伤害提高5%\n无双提高10%",
    },
};

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
        detail: "使用御厨套装武器技能，展开一桌美味盛宴。可以在每桌吟冬卧雪盛宴中获得一层吟冬卧雪效果，提升自身破防151点，全会心151点，最多叠加8层。",
    },
};
const 团队增益: Effects = {
    目标易伤: {
        options: [
            { name: "秋肃", color: "default", detail: "来源：明尊琉璃体\n受到的伤害提高6%，不可与同类效果叠加" },
            { name: "戒火", color: "default", detail: "来源：离经易道\n受到的伤害提高2%" },
        ],
    },
    立地成佛: {
        options: null,
        detail: "来源：洗髓经\n每层使目标内功防御等级降低3%",
    },
    袖气: {
        options: null,
        detail: "来源：七秀\n全属性提高244点，内功防御等级提高340点",
    },
    号令三军: {
        options: null,
        stacknum: 48,
        detail: "来源：铁牢律\n每层提高无双值500点。战斗时间30秒后层数减半，60秒后完全消失。\n使用时需注意: 号令三军会受到战斗时间影响 (严格循环不支持自定义战斗时间).",
    },
    弘法: {
        options: null,
        stacknum: 36,
        covrate: 0.5,
        detail: "来源：洗髓经\n每层使无双等级提高500点、基础疗伤成效提高520点",
    },
    朝圣言: {
        options: [
            { name: "朝圣", color: "default", detail: "来源：明尊琉璃体 技能\n每层使无双等级提高500点" },
            { name: "圣浴明心", color: "default", detail: "来源：明尊琉璃体 奇穴\n每层使无双等级提高875点" },
        ],
        stacknum: 24,
        covrate: 0.05,
    },
    振奋: {
        options: null,
        stacknum: 125,
        covrate: 1.0,
        detail: "来源：铁骨衣\n每层使外功、内功破防等级提高60点",
    },
    左旋右转: {
        options: null,
        stacknum: 150,
        covrate: 1.0,
        detail: "来源：云裳心经\n每层使破招值提升54点",
    },
    寒啸千军: {
        options: null,
        covrate: 0.5,
        detail: "来源：铁骨衣\n内外功破防等级提高20%",
    },
    皎素: {
        options: null,
        covrate: 0.15,
        detail: "来源：离经易道\n会心效果提高5%",
    },
    仙王蛊鼎: {
        options: null,
        covrate: 0.25,
        detail: "来源：补天诀\n造成的伤害提高12%",
    },
    飘黄: {
        options: null,
        covrate: 0.17,
        detail: "来源：灵素\n施展伤害招式附带一段额外伤害，最多每1.5秒触发一次，每次持续10秒",
    },
    庄周梦: {
        options: null,
        stacknum: 200,
        covrate: 0.75,
        detail: "来源：相知\n每层使目标的无双等级提高50点",
    },
    配伍: {
        options: null,
        stacknum: 5,
        covrate: 1.0,
        detail: "来源：灵素\n每层使力道、身法、元气和根骨提高1%\ntips: 团队第1小队第1个成员可视为全程覆盖",
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

const FormationRender = ({ item }: { item: Form }) => {
    return (
        <div className="w-full flex justify-center items-center gap-2 pr-4">
            <Image width={32} alt={item.kungfu} src={`https://icon.jx3box.com/icon/${item.iconKungfu}.png`} />
            <p className="w-1/3">{item.kungfu}</p>
            <Image width={32} alt={item.name} src={`https://icon.jx3box.com/icon/${item.iconFormation}.png`} />
            <p className="w-1/3">{item.name}</p>
        </div>
    );
};

const Formation = ({
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
    const checked = dataInputs[index].effects.hasOwnProperty("小队阵法");
    function createComparePage() {
        updateInputs((draft) => {
            const newDraft: DataInput[] = [JSON.parse(JSON.stringify(draft[index]))];
            const covrate = newDraft[0].effects.hasOwnProperty("小队阵法")
                ? (newDraft[0].effects["小队阵法"] as DataEffect).covrate
                : 1.0;
            delete newDraft[0].effects["小队阵法"];
            newDraft[0].name = "基准页";
            for (let key in formationTab) {
                if (key === "Compare") continue;
                newDraft.push(JSON.parse(JSON.stringify(newDraft[0])));
                newDraft[newDraft.length - 1].effects["小队阵法"] = {
                    name: key,
                    covrate: covrate,
                };
                newDraft[newDraft.length - 1].name = formationTab[key].name;
            }
            return newDraft;
        });
        setPage(1);
    }
    return (
        <div className="w-full flex flex-col xl:flex-row justify-center items-center col-span-full">
            <Checkbox
                key={"checkbox" + name}
                classNames={{
                    base: "w-full max-w-full",
                    label: "w-full",
                }}
                className="w-full basis-3/4"
                isSelected={checked}
                onValueChange={(stat) => {
                    updateInput((draft) => {
                        if (stat) {
                            draft.effects["小队阵法"] = {
                                name: "易筋经·天鼓雷音阵",
                                covrate: 1.0,
                            };
                        } else {
                            delete draft.effects["小队阵法"];
                        }
                    });
                }}
            >
                <Select
                    label="小队阵法"
                    size="lg"
                    radius="lg"
                    variant="bordered"
                    className="w-full"
                    disallowEmptySelection
                    isDisabled={!checked}
                    selectedKeys={checked ? [(dataInputs[index].effects["小队阵法"] as DataEffect).name as string] : []}
                    onChange={(e) => {
                        if (e.target.value === "·") {
                            createComparePage();
                        } else {
                            updateInput((draft) => {
                                (draft.effects["小队阵法"] as DataEffect).name = e.target.value;
                            });
                        }
                    }}
                    items={Object.keys(formationTab).map((name) => formationTab[name])}
                    renderValue={(items: SelectedItems<Form>) =>
                        items.map((item) => {
                            if (!item.data) return <></>;
                            const name = item.data.kungfu + "·" + item.data.name;
                            return <FormationRender key={name} item={item.data} />;
                        })
                    }
                >
                    {(item) => {
                        const name = item.kungfu + "·" + item.name;
                        if (name === "·") {
                            return (
                                <SelectSection key={"Compare"} showDivider>
                                    <SelectItem key={name} aria-label={name}>
                                        <div className="w-full px-2 flex flex-col gap-0.5 whitespace-normal">
                                            <p className="text-base">创建 小队阵法 对比</p>
                                            <p className="text-xs">
                                                <span className="text-red-500">删除其他所有页面, </span>将当前页面提升为
                                                <span className="text-green-500">基准页</span>,
                                                <br />
                                                并以其为基准, 创建<span className="text-green-500">对比小队阵法</span>
                                                所需的页面.
                                            </p>
                                        </div>
                                    </SelectItem>
                                </SelectSection>
                            );
                        }
                        return (
                            <SelectItem key={name} aria-label={name}>
                                <FormationRender item={item} />
                            </SelectItem>
                        );
                    }}
                </Select>
            </Checkbox>
            <EffectCovrate
                className="w-full max-w-40 basis-1/4 pl-4 pt-2 xl:pb-2"
                name="小队阵法"
                dataInput={dataInputs[index]}
                updateInput={updateInput}
            />
        </div>
    );
};

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
    const 增益 = [物品增益, 团队增益, 小队增益];
    const 增益标题 = ["物品增益", "团队增益", "小队增益"];

    const content = (
        <div className="w-full flex flex-col justify-center items-center gap-y-4">
            <Formation
                dataInputs={dataInputs}
                page={page}
                updateInputs={updateInputs}
                updateInput={updateInput}
                setPage={setPage}
            />
            {/* <div className="w-full grid xl:grid-cols-2 justify-items-center items-center gap-y-4">
                {Object.keys(物品增益).map((name) => (
                    <Effect
                        key={"effect" + name}
                        name={name}
                        dataInput={dataInputs[index]}
                        updateInput={updateInput}
                        options={物品增益[name].options}
                        stacknum={物品增益[name].stacknum}
                        covrate={物品增益[name].covrate}
                        detail={物品增益[name].detail}
                    />
                ))}
            </div>
            <div className="w-full grid xl:grid-cols-2 justify-items-center items-center gap-y-4">
                {Object.keys(团队增益).map((name) => (
                    <Effect
                        key={"effect" + name}
                        name={name}
                        dataInput={dataInputs[index]}
                        updateInput={updateInput}
                        options={团队增益[name].options}
                        stacknum={团队增益[name].stacknum}
                        covrate={团队增益[name].covrate}
                        detail={团队增益[name].detail}
                    />
                ))}
            </div>
            <div className="w-full grid xl:grid-cols-2 justify-items-center items-center gap-y-4">
                {Object.keys(小队增益).map((name) => (
                    <Effect
                        key={"effect" + name}
                        name={name}
                        dataInput={dataInputs[index]}
                        updateInput={updateInput}
                        options={小队增益[name].options}
                        stacknum={小队增益[name].stacknum}
                        covrate={小队增益[name].covrate}
                        detail={小队增益[name].detail}
                    />
                ))}
            </div> */}
            <Accordion selectionMode="multiple" defaultExpandedKeys={增益标题}>
                {增益.map((effects, i) => (
                    <AccordionItem key={增益标题[i]} aria-label={增益标题[i]} title={增益标题[i]}>
                        <div
                            key={"effect" + i}
                            className="w-full grid xl:grid-cols-2 justify-items-center items-center gap-y-4"
                        >
                            {Object.keys(effects).map((name) => (
                                <Effect
                                    key={"effect" + name}
                                    name={name}
                                    dataInput={dataInputs[index]}
                                    updateInput={updateInput}
                                    options={effects[name].options}
                                    stacknum={effects[name].stacknum}
                                    covrate={effects[name].covrate}
                                    detail={effects[name].detail}
                                />
                            ))}
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>
            <Spacer y={2} />
        </div>
    );
    if (window.matchMedia("(min-width: 1280px)").matches) {
        return (
            <ScrollShadow hideScrollBar className="w-full">
                {content}
            </ScrollShadow>
        );
    } else {
        return content;
    }
};
