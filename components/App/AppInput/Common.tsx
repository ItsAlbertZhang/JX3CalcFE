"use client";
// my libraries
import { DataEffect, DataInput } from "@/components/definitions";
// third party libraries
import { Checkbox, Input, Select, SelectItem, SelectedItems } from "@nextui-org/react";

export function validateInteger(value: string) {
    if (value == "") {
        return true;
    }
    if (!/^[0-9]*$/.test(value)) {
        return false;
    }
    return true;
}

export const IntegerInput = ({
    data,
    update,
    keys,
    label,
    max,
}: {
    data: any;
    update: (fn: (draft: any) => void) => void;
    keys: string[];
    label: string;
    max?: number;
}) => {
    function getValue(obj: any, keys: string[]) {
        return keys
            .reduce((maxValue, key) => {
                const value = obj[key];
                if (typeof value === "number") {
                    return Math.max(maxValue, value);
                } else {
                    return maxValue;
                }
            }, -Infinity)
            .toString();
    }
    return (
        <Input
            size="sm"
            label={label}
            value={getValue(data, keys)}
            onValueChange={(newValue: string) => {
                if (validateInteger(newValue)) {
                    let value = Number(newValue);
                    if (max && value > max) {
                        value = max;
                    }
                    update((draft: any) => {
                        keys.forEach((key) => {
                            draft[key] = value;
                        });
                    });
                }
            }}
        />
    );
};

export interface TypeOption {
    name: string;
    color: "default" | "blue" | "purple" | "orange";
    tip?: string;
    detail?: string;
}

const EffectItemRender = ({ option, isItem = false }: { option: TypeOption; isItem?: boolean }) => {
    let title = "";
    switch (option.color) {
        case "blue":
            title = "text-blue-500";
            break;
        case "purple":
            title = "text-purple-500";
            break;
        case "orange":
            title = "text-orange-500";
            break;
    }
    return (
        <div className="w-full flex flex-col justify-center items-center gap-1">
            <div className="w-full flex justify-between items-center gap-1">
                <p className={title}>{option.name}</p>
                {option.tip ? <p className="text-sm">{option.tip}</p> : <></>}
            </div>
            {isItem && option.detail ? (
                <p className="w-full text-xs text-left whitespace-pre-line">{option.detail}</p>
            ) : (
                <></>
            )}
        </div>
    );
};

export const Effect = ({
    name,
    options,
    dataInput,
    updateInput,
    stacknum,
    covrate,
    className = "",
}: {
    name: string;
    options: string[] | TypeOption[] | null | undefined;
    dataInput: DataInput;
    updateInput: (fn: (draft: DataInput) => void) => void;
    stacknum?: number;
    covrate?: number;
    className?: string;
}) => {
    const isString = options && typeof options[0] === "string";
    const twoLines = stacknum && covrate;
    const optionsSelect = (items: SelectedItems<TypeOption>) =>
        items.map((item) =>
            item.data ? <EffectItemRender key={"effect-render" + item.data.name} option={item.data} /> : <></>
        );
    const optionsSelectItem = (item: TypeOption) => (
        <SelectItem key={item.name} textValue={item.name}>
            <EffectItemRender option={item} isItem />
        </SelectItem>
    );
    const title = options ? (
        <Select
            key={"select" + name}
            label={name}
            size="sm"
            radius="lg"
            variant={twoLines ? "underlined" : "bordered"}
            className="w-full"
            disallowEmptySelection
            isDisabled={!dataInput.effects.hasOwnProperty(name)}
            selectedKeys={
                dataInput.effects.hasOwnProperty(name) && (stacknum || covrate)
                    ? [(dataInput.effects[name] as DataEffect).name as string]
                    : [dataInput.effects[name] as string]
            }
            onChange={(e) => {
                updateInput((draft) => {
                    if (stacknum || covrate) {
                        (draft.effects[name] as DataEffect).name = e.target.value;
                    } else {
                        draft.effects[name] = e.target.value;
                    }
                });
            }}
            items={isString ? undefined : (options as TypeOption[])}
            renderValue={isString ? undefined : optionsSelect}
        >
            {isString
                ? (options as string[]).map((item) => (
                      <SelectItem key={item} textValue={item}>
                          {item}
                      </SelectItem>
                  ))
                : optionsSelectItem}
        </Select>
    ) : (
        <p
            className={
                "w-full py-3 text-center text-sm" +
                (dataInput.effects.hasOwnProperty(name) ? " text-neutral-400" : " text-neutral-600") +
                (twoLines ? " border-b-2 border-neutral-700" : " border-2 border-neutral-700 rounded-2xl")
            }
        >
            {name}
        </p>
    );

    let snv: string | undefined;
    if (dataInput.effects.hasOwnProperty(name) && typeof dataInput.effects[name] === "object") {
        const n = (dataInput.effects[name] as DataEffect).stacknum;
        if (n) {
            snv = n.toString();
        }
    }
    const sn = stacknum ? (
        <Input
            label="层数"
            size="sm"
            radius="lg"
            isDisabled={!dataInput.effects.hasOwnProperty(name)}
            onClick={(event) => {
                event.stopPropagation();
                event.currentTarget.focus();
            }}
            value={snv ? snv : ""}
            onValueChange={(value) => {
                if (validateInteger(value)) {
                    let newValue = parseInt(value);
                    newValue = newValue > stacknum ? stacknum : newValue;
                    updateInput((draft) => {
                        const it = draft.effects[name] as DataEffect;
                        it.stacknum = newValue;
                        draft.effects[name] = it;
                    });
                }
            }}
        />
    ) : (
        <></>
    );
    let cvv: string | undefined;
    if (dataInput.effects.hasOwnProperty(name) && typeof dataInput.effects[name] === "object") {
        const n = (dataInput.effects[name] as DataEffect).covrate;
        if (n) {
            cvv = (n * 100).toFixed(0);
        }
    }
    const cv = covrate ? (
        <Input
            label="覆盖率"
            size="sm"
            radius="lg"
            endContent={<p className="text-sm">%</p>}
            isDisabled={!dataInput.effects.hasOwnProperty(name)}
            onClick={(event) => {
                event.stopPropagation();
                event.currentTarget.focus();
            }}
            value={cvv ? cvv : ""}
            onValueChange={(value) => {
                if (validateInteger(value)) {
                    let newValue = parseInt(value);
                    newValue = newValue > 100 ? 100 : newValue;
                    updateInput((draft) => {
                        const it = draft.effects[name] as DataEffect;
                        it.covrate = newValue / 100;
                        draft.effects[name] = it;
                    });
                }
            }}
        />
    ) : (
        <></>
    );
    const add = (
        <div className={"w-full flex justify-center items-center gap-2"}>
            {sn}
            {cv}
        </div>
    );

    const content = (
        <div
            className={
                "w-full flex justify-center items-center gap-2" +
                (twoLines ? " flex-col border-2 border-neutral-700 rounded-2xl p-2" : "")
            }
        >
            {title}
            {stacknum || covrate ? add : <></>}
        </div>
    );

    return (
        <Checkbox
            key={"checkbox" + name}
            classNames={{
                base: "w-full max-w-full",
                label: "w-full",
            }}
            className={className}
            isSelected={dataInput.effects.hasOwnProperty(name)}
            onValueChange={(stat) => {
                updateInput((draft) => {
                    if (stat) {
                        const temp = options
                            ? typeof options[0] === "string"
                                ? options[0]
                                : options[0].name
                            : undefined;
                        if (stacknum || covrate) {
                            const obj: DataEffect = {
                                name: temp,
                                stacknum: stacknum,
                                covrate: covrate,
                            };
                            draft.effects[name] = obj;
                        } else {
                            draft.effects[name] = temp ? temp : true;
                        }
                    } else {
                        delete draft.effects[name];
                    }
                });
            }}
        >
            {content}
        </Checkbox>
    );
};
