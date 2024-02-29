"use client";
// my libraries
import { ContextUserinput } from "@/components/context";
import { ibrString } from "@/components/definitions";
// third party libraries
import { Button } from "@nextui-org/react";
import { useContext } from "react";

async function create(input: object) {
    const response = await fetch(`http://${window.location.hostname}:12897/create`, {
        method: "POST",
        body: JSON.stringify(input),
    });
    console.log(JSON.stringify(input));
    const data = await response.json();
    console.log(data);
    return data as ibrString;
}

export const Calculate = ({ status, setStatus }: { status: string; setStatus: (value: string) => void }) => {
    const userinput = useContext(ContextUserinput).value;
    async function handleClick() {
        try {
            const response = await create(userinput);
            if (response.status === 0) {
                setStatus(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Button isDisabled={!["init", "waiting"].includes(status)} onClick={handleClick} color="primary">
            计算
        </Button>
    );
};
