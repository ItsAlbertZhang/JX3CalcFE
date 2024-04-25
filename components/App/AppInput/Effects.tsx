"use client";
// my libraries
import { DataInput } from "@/components/definitions";
// third party libraries
import { CheckboxGroup, Checkbox } from "@nextui-org/react";

export const Effects = ({
    dataInput,
    updateInput,
}: {
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
}) => {
    const effects = [
        ["大附魔·腰", "大附魔·腕", "大附魔·鞋", "家园酒·加速"],
        ["套装·技能", "套装·特效", "腰坠·特效", "武器·橙武", "武器·水特效"],
    ];
    return (
        <div className="flex justify-center items-center gap-8">
            {effects.map((col, idx) => {
                return (
                    <CheckboxGroup key={"effects" + idx} className="items-center" value={dataInput.effects}>
                        {col.map((str) => {
                            return (
                                <Checkbox
                                    key={str}
                                    value={str}
                                    onValueChange={(isSelected: boolean) => {
                                        updateInput((draft) => {
                                            if (isSelected) {
                                                if (!draft.effects.includes(str)) {
                                                    draft.effects = [...draft.effects, str];
                                                }
                                            } else {
                                                draft.effects = draft.effects.filter((v) => v !== str);
                                            }
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
