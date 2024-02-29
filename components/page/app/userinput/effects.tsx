"use client";
// my libraries
import { ContextUserinput } from "@/components/context";
// third party libraries
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useContext } from "react";

export const Effects = () => {
    const { value, setValue } = useContext(ContextUserinput);
    const effects = [
        ["大附魔·腰", "大附魔·腕", "大附魔·鞋"],
        ["套装·技能", "套装·特效", "武器·水特效", "家园酒·加速"],
    ];
    return (
        <div className="flex justify-center items-center h-full gap-8">
            {effects.map((col, idx) => {
                return (
                    <CheckboxGroup key={"effects" + idx} className="items-center" value={value.effects}>
                        {col.map((str) => {
                            return (
                                <Checkbox
                                    key={str}
                                    value={str}
                                    onValueChange={(isSelected: boolean) => {
                                        setValue({
                                            ...value,
                                            effects: isSelected
                                                ? [...value.effects, str]
                                                : value.effects.filter((item) => item !== str),
                                        });
                                    }}
                                >
                                    {str}
                                </Checkbox>
                            );
                        })}
                    </CheckboxGroup>
                );
            })}
        </div>
    );
};
