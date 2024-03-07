"use client";
// my libraries
import { createTask } from "@/components/actions";
import { ContextUserinput, ContextUserinputLatest } from "@/components/context";
import { ibrString } from "@/components/definitions";
// third party libraries
import { Button } from "@nextui-org/react";
import { useContext } from "react";

export const Calculate = ({
    id,
    setID,
    calculating,
    setCalculating,
}: {
    id: string | undefined;
    setID: (value: string) => void;
    calculating: boolean;
    setCalculating: (value: boolean) => void;
}) => {
    const userinput = useContext(ContextUserinput).value;
    const setLatest = useContext(ContextUserinputLatest).setValue;
    async function handleClick() {
        try {
            const response = (await createTask(userinput)) as ibrString;
            if (response.status === 0) {
                setID(response.data);
                setCalculating(true);
                setLatest(userinput);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Button isDisabled={calculating} onPress={handleClick} color="primary">
            计算
        </Button>
    );
};
