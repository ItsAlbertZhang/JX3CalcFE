"use client";
// my libraries
import { fetchPostJson } from "@/components/actions";
import { ContextUserinput } from "@/components/context";
import { ibrString } from "@/components/definitions";
// third party libraries
import { Button } from "@nextui-org/react";
import { useContext } from "react";

async function create(input: object) {
    console.log(JSON.stringify(input));
    const data = await fetchPostJson({ port: 12897, path: "/create", body: input });
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
