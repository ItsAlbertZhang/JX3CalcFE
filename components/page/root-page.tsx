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

const version = "v1.1";

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

    let content: JSX.Element;
    if (!status) {
        content = <Loading />;
    } else if (status.status !== 0) {
        content = <Setting setStatus={setStatus} />;
    } else if (!status.data.version.startsWith(version)) {
        content = <Updating />;
    } else {
        content = (
            <ContextBRStatus.Provider value={status.data}>
                <App />
            </ContextBRStatus.Provider>
        );
    }

    return (
        <div
            className="
                p-6 m-auto
                w-full md:w-4/5 lg:w-2/3 xl:w-full
                min-h-screen xl:max-h-screen
                flex flex-col gap-8
                xl:grid xl:grid-cols-3
                justify-center justify-items-center items-center"
        >
            {content}
        </div>
    );
};
