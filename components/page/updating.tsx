"use client";
// third party libraries
import { Spacer, Spinner } from "@nextui-org/react";

export const Updating = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <Spinner />
            <Spacer y={4} />
            <p>正在尝试更新</p>
        </div>
    );
};
