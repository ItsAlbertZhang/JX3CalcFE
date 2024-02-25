// Page Component: UserInput Base
"use client";

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

export const UIInteger = ({
    state,
    setState,
    keys,
    label,
}: {
    state: any;
    setState: (value: any) => void;
    keys: string[];
    label: string;
}) => {
    return (
        <Input
            size="sm"
            label={label}
            value={
                keys.filter((key) => key in state).length > 0
                    ? Math.max(...keys.filter((key) => key in state).map((key) => state[key])).toString()
                    : "0"
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;
                if (validateInteger(newValue)) {
                    const newState = keys.reduce((obj, key) => ({ ...obj, [key]: Number(newValue) }), {});
                    setState({ ...state, ...newState });
                }
            }}
        />
    );
};
