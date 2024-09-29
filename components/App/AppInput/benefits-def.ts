import { TypeOption } from "./Common";

export interface Form {
    kungfu: string;
    name: string;
    iconKungfu: number;
    iconFormation: number;
    detail: string;
}

export interface Effects {
    [key: string]: {
        options: TypeOption[] | string[] | null;
        stacknum?: number;
        covrate?: number;
        detail?: string;
    };
}
