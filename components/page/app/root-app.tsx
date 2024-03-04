"use client";
// child components simple
import { Calculate } from "./calculate";
import { WebDownload } from "./web-download";
// child components complex
import { Result } from "./result/root-result";
import { Userinput } from "./userinput/root-userinput";
// my libraries
import { ContextUserinput, ContextUserinputLatest } from "@/components/context";
import { ClsUserinput } from "@/components/definitions";
// third party libraries
import { motion } from "framer-motion";
import { useState } from "react";

export const App = () => {
    const [userinput, setUserinput] = useState<ClsUserinput>(new ClsUserinput());
    const [latest, setLatest] = useState<ClsUserinput>(new ClsUserinput());
    const [calculating, setCalculating] = useState<boolean>(false);
    const [id, setID] = useState<string>();

    const content = (
        <>
            <motion.div
                className="basis-full 2xl:basis-1/3 flex flex-col justify-center items-center gap-8"
                layout // Animate layout changes
                transition={{ type: "spring", duration: 1, bounce: 0.33 }}
            >
                <Userinput />
                <Calculate id={id} setID={setID} calculating={calculating} setCalculating={setCalculating} />
            </motion.div>
            {typeof id !== "undefined" && (
                <div className="basis-full 2xl:basis-2/3 flex">
                    <Result id={id} setID={setID} setCalculating={setCalculating} userinputLatest={latest} />
                </div>
            )}
        </>
    );
    return (
        <div className="basis-full flex flex-col justify-center items-center gap-8 2xl:flex-row">
            <WebDownload />
            <ContextUserinput.Provider value={{ value: userinput, setValue: setUserinput }}>
                <ContextUserinputLatest.Provider value={{ value: latest, setValue: setLatest }}>
                    {content}
                </ContextUserinputLatest.Provider>
            </ContextUserinput.Provider>
        </div>
    );
};
