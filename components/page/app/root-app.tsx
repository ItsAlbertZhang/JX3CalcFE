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

    const input = (
        <motion.div
            className={
                (typeof id === "undefined" ? "col-start-2 " : "") +
                "col-span-1 flex flex-col justify-center items-center gap-8"
            }
            layout // Animate layout changes
            transition={{ type: "spring", duration: 1, bounce: 0.33 }}
        >
            <Userinput />
            <Calculate id={id} setID={setID} calculating={calculating} setCalculating={setCalculating} />
        </motion.div>
    );
    const result =
        typeof id === "undefined" ? (
            <></>
        ) : (
            <div className="col-span-2 grid grid-rows-9 gap-4 w-full h-full">
                <Result id={id} setID={setID} setCalculating={setCalculating} userinputLatest={latest} />
            </div>
        );

    return (
        <>
            <WebDownload />
            <ContextUserinput.Provider value={{ value: userinput, setValue: setUserinput }}>
                <ContextUserinputLatest.Provider value={{ value: latest, setValue: setLatest }}>
                    {input} {result}
                </ContextUserinputLatest.Provider>
            </ContextUserinput.Provider>
        </>
    );
};
