"use client";
// child components simple
import { Calculate } from "./calculate";
import { WebDownload } from "./web-download";
// child components complex
import { Result } from "./result/root-result";
import { Userinput } from "./userinput/root-userinput";
// my libraries
import { ContextUserinput } from "@/components/context";
import { ibrQueryDps, ClsUserinput } from "@/components/definitions";
// third party libraries
import { useState } from "react";

export const App = () => {
    const [userinput, setUserinput] = useState<ClsUserinput>(new ClsUserinput());
    const [dps, setDPS] = useState<ibrQueryDps["data"] | undefined>();

    return (
        <div className="flex flex-col w-full justify-center items-center m-6 gap-8 md:w-4/5 lg:w-2/3 xl:w-1/2 2xl:w-full 2xl:flex-row">
            <WebDownload />
            <div className="flex flex-col w-full h-full justify-center items-center gap-8 2xl:basis-1/3">
                <ContextUserinput.Provider value={{ value: userinput, setValue: setUserinput }}>
                    <Userinput />
                </ContextUserinput.Provider>
                <Calculate userinput={userinput} setDPS={setDPS} />
            </div>
            <div className="flex flex-col w-full h-full justify-center items-center gap-8 2xl:basis-2/3">
                <Result dps={dps} />
            </div>
        </div>
    );
};
