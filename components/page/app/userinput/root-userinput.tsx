"use client";
// child components simple
import { Attribute } from "./attribute";
import { Effects } from "./effects";
import { Global } from "./global";

export const Userinput = () => {
    return (
        <div className="basis-full flex flex-col justify-center items-center gap-8">
            <Global />
            <Attribute />
            <Effects />
        </div>
    );
};
