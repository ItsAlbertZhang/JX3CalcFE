"use client";
// child components simple
import { Attribute } from "./attribute";
import { Effects } from "./effects";
import { Global } from "./global";

export const Userinput = () => {
    return (
        <div className="flex flex-col w-full justify-center items-center gap-8">
            <Global />
            <Attribute />
            <Effects />
        </div>
    );
};
