"use client";

import { Loading } from "./loading";
import { fetchServerStatus, Setting } from "./setting";
import { Updating } from "./updating";

import { App } from "./app/root";

import { iResponseStatus } from "@/components/definitions";

import { useEffect, useState } from "react";

const version = "24022701";

export const Main = () => {
    const [status, setStatus] = useState<iResponseStatus | undefined>();
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
        ret = <App status={status.data} />;
    }
    return <div className="flex justify-center min-h-screen w-full">{ret}</div>;
};
