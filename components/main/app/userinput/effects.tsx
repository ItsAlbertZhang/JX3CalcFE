"use client";

import { ClsUserInput } from "@/components/definitions";

import { CheckboxGroup, Checkbox } from "@nextui-org/react";

export const Effects = ({ state, setState }: { state: ClsUserInput; setState: (value: ClsUserInput) => void }) => {
    const effects = [
        ["大附魔·腰", "大附魔·腕", "大附魔·鞋"],
        ["套装·技能", "套装·特效", "武器·水特效", "家园酒·加速"],
    ];
    return (
        <div className="flex justify-center items-center w-full gap-8">
            {effects.map((col, idx) => {
                return (
                    <CheckboxGroup key={"effects" + idx} className="items-center" value={state.effects}>
                        {col.map((str) => {
                            return (
                                <Checkbox
                                    key={str}
                                    value={str}
                                    onValueChange={(isSelected: boolean) => {
                                        setState({
                                            ...state,
                                            effects: isSelected
                                                ? [...state.effects, str]
                                                : state.effects.filter((item) => item !== str),
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
