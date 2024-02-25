// Page Component: UserInput: Effects
"use client";

import { ClsUserInput } from "./definitions";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";

export const UIEffects = ({ state, setState }: { state: ClsUserInput; setState: (value: ClsUserInput) => void }) => {
    const cn = "flex justify-center items-center h-full w-full gap-10";
    const effects = [
        ["大附魔·腰", "大附魔·腕", "大附魔·鞋"],
        ["套装·技能", "套装·特效", "武器·水特效", "家园酒·加速"],
    ];
    return (
        <div className={cn}>
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
