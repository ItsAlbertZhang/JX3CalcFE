import { ibrStatus, ClsUserinput } from "@/components/definitions";

import { createContext } from "react";

/**
    为了符合 TypeScript 的类型检查, 需要在声明 Context 时为其指定模板类型. 一旦声明模板类型, 必须为其赋初始值.
    也可以指定其模板类型为 ... | undefined 以绕过赋初始值的步骤, 代价是使用时需要进行检查.
 */
export const ContextUserinput = createContext<{ value: ClsUserinput; setValue: (value: ClsUserinput) => void }>({
    value: new ClsUserinput(),
    setValue: () => {},
});
export const ContextBRStatus = createContext<ibrStatus["data"] | undefined>(undefined);
