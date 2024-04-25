"use client";
// third party libraries
import { Input } from "@nextui-org/react";

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
