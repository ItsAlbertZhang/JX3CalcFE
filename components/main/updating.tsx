"use client";

import { Spacer, Spinner } from "@nextui-org/react";

export const Updating = () => {
    return (
        <>
            <Spinner />
            <Spacer y={4} />
            <p>发现新版本</p>
            <p>正在尝试自动更新, 请保持网络畅通</p>
        </>
    );
};
