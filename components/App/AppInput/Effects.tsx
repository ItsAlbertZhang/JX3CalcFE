"use client";
// my libraries
import { DataInput } from "@/components/definitions";
// third party libraries
import { Checkbox, Select, SelectItem, cn } from "@nextui-org/react";

export const Effects = ({
    dataInput,
    updateInput,
}: {
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
}) => {
    const effects = {
        "套装·技能": null,
        "套装·特效": null,
        "家园·酿造": ["女儿红"],
        "大附魔·腰": null,
        "大附魔·腕": ["雾海寻龙", "万灵当歌"],
        "大附魔·鞋": ["雾海寻龙", "万灵当歌"],
        "腰坠·特效": ["梧桐影", "吹香雪"],
        "武器·特效": ["血月", "封霜曲刃·忆", "无尽沙海", "冰焰玉"],
    };
    const ret = Object.entries(effects).map(([name, options], idx) => (
        <div
            key={"div" + name}
            className={"w-full" + (idx === Object.keys(effects).length - 1 ? " xl:col-span-2" : "")}
        >
            <Checkbox
                key={"checkbox" + name}
                classNames={{
                    base: "w-full max-w-md",
                    label: "w-full",
                }}
                isSelected={dataInput.effects.hasOwnProperty(name)}
                onChange={(e) => {
                    updateInput((draft) => {
                        if (e.target.checked) {
                            draft.effects[name] = options ? options[0] : true;
                        } else {
                            delete draft.effects[name];
                        }
                    });
                }}
            >
                {options ? (
                    <Select
                        key={"select" + name}
                        label={name}
                        size="sm"
                        radius="lg"
                        // variant={dataInput.effects.hasOwnProperty(name) ? "faded" : "bordered"}
                        variant="bordered"
                        className="w-full"
                        disallowEmptySelection
                        isDisabled={!dataInput.effects.hasOwnProperty(name)}
                        selectedKeys={[dataInput.effects[name] as string]}
                        onChange={(e) => {
                            updateInput((draft) => {
                                draft.effects[name] = e.target.value;
                            });
                        }}
                    >
                        {options.map((item) => (
                            <SelectItem key={item}>{item}</SelectItem>
                        ))}
                    </Select>
                ) : (
                    <p className="py-3 border-2 border-neutral-700 rounded-2xl text-center text-neutral-400">{name}</p>
                )}
            </Checkbox>
        </div>
    ));
    return (
        <div className={`w-full grid grid-flow-row grid-cols-2 xl:grid-cols-3 justify-items-center items-center gap-3`}>
            {ret}
        </div>
    );
};
