"use client";
// child components simple
import { Effect, EffectCovrate } from "./Common";
import { Form } from "./benefits-def";
import * as benefitshd from "./benefits-hd";
import * as benefitsexp from "./benefits-exp";
// my libraries
import { DataEffect, DataInput, TypeStatus } from "@/components/definitions";
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
    status,
    dataInputs,
    page,
    updateInputs,
    updateInput,
    setPage,
}: {
    status: TypeStatus;
    dataInputs: DataInput[];
    page: number;
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    updateInput: (fn: (draft: DataInput) => void) => void;
    setPage: (page: number) => void;
}) => {
    const index = page - 1;
    const checked = dataInputs[index].effects.hasOwnProperty("小队阵法");
    const benefit = status.data.client === "jx3_hd" ? benefitshd : benefitsexp;
    const formationTab = benefit.formationTab;
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
                                    <SelectItem key={name} aria-label={name} className="bg-blue-600">
                                        <div className="w-full px-2 flex flex-col gap-0.5 whitespace-normal">
                                            <p className="text-xl">创建 小队阵法 对比</p>
                                            <p className="text-base text-red-500">注意: 会影响其他页面!</p>
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
    status,
    dataInputs,
    page,
    updateInputs,
    updateInput,
    setPage,
}: {
    status: TypeStatus;
    dataInputs: DataInput[];
    page: number;
    updateInputs: (fn: (draft: DataInput[]) => void) => void;
    updateInput: (fn: (draft: DataInput) => void) => void;
    setPage: (page: number) => void;
}) => {
    const index = page - 1;
    const benefit = status.data.client === "jx3_hd" ? benefitshd : benefitsexp;
    const 增益 = [benefit.物品增益, benefit.团队增益, benefit.小队增益];
    const 增益标题 = ["物品增益", "团队增益", "小队增益"];

    const content = (
        <div className="w-full flex flex-col justify-center items-center gap-y-4">
            <Formation
                status={status}
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
