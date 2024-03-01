"use client";
// child components simple
import { Loading } from "./loading";
import { Setting, fetchServerStatus } from "./setting";
import { Updating } from "./updating";
// child components complex
import { App } from "./app/root-app";
// my libraries
import { ContextBRStatus } from "@/components/context";
import { ibrStatus } from "@/components/definitions";
// third party libraries
import { useEffect, useState } from "react";

const version = "24022801";

export const Page = () => {
    const [status, setStatus] = useState<ibrStatus>();
    useEffect(() => {
        async function f() {
            try {
                setStatus(await fetchServerStatus());
            } catch (error) {
                console.error(error);
            }
        }
        f();
    }, []);

    let ret: JSX.Element;
    if (!status) {
        ret = <Loading />;
    } else if (status.status !== 0) {
        ret = <Setting setStatus={setStatus} />;
    } else if (status.data.version != version) {
        ret = <Updating />;
    } else {
        ret = (
            <ContextBRStatus.Provider value={status.data}>
                <App />
            </ContextBRStatus.Provider>
        );
    }
    return <div className="flex justify-center min-h-screen w-full 2xl:max-h-screen 2xl:max-w-[100vw]">{ret}</div>;
};
