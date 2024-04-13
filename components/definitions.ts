export interface TypeBackendRes {
    status: number;
    data: any;
}

export interface TypeStatus extends TypeBackendRes {
    data: {
        version: string;
        userinput: {
            maxDelayNetwork: number;
            maxDelayKeyboard: number;
            maxFightTime: number;
            maxFightCount: number;
        };
        custom: boolean;
    };
}

export interface TypeString extends TypeBackendRes {
    data: string;
}

export interface TypeQueryDPS extends TypeBackendRes {
    data: {
        complete: boolean;
        current: number;
        total: number;
        speed: number;
        avg: number;
        min: number;
        max: number;
        sd: number;
        ci99: number;
        md: number;
        list: number[];
    };
}

export interface TypeQueryDamageAnalysis extends TypeBackendRes {
    data: {
        damageMax: number;
        damageMin: number;
        id: number;
        level: number;
        name: string;
        proportion: number;
    }[];
}

export interface TypeQueryDamageList extends TypeBackendRes {
    data: {
        criticalRate: number;
        damageBase: number;
        damageCritical: number;
        damageExcept: number;
        isCritical: boolean;
        id: number;
        level: number;
        name: string;
        time: number;
        type: number;
    }[][];
}

export class DataAttribute {
    Vitality = 0;
    Strength = 0;
    Agility = 0;
    Spirit = 0;
    Spunk = 0;
    PhysicsAttackPowerBase = 0;
    SolarAttackPowerBase = 0;
    LunarAttackPowerBase = 0;
    NeutralAttackPowerBase = 0;
    PoisonAttackPowerBase = 0;
    PhysicsCriticalStrike = 0;
    SolarCriticalStrike = 0;
    LunarCriticalStrike = 0;
    NeutralCriticalStrike = 0;
    PoisonCriticalStrike = 0;
    PhysicsCriticalDamagePower = 0;
    SolarCriticalDamagePower = 0;
    LunarCriticalDamagePower = 0;
    NeutralCriticalDamagePower = 0;
    PoisonCriticalDamagePower = 0;
    PhysicsOvercomeBase = 0;
    SolarOvercomeBase = 0;
    LunarOvercomeBase = 0;
    NeutralOvercomeBase = 0;
    PoisonOvercomeBase = 0;
    SurplusValue = 0;
    Strain = 0;
    Haste = 0;
    MeleeWeaponDamage = 0; // 武器伤害基础值, 原数据中存在此字段
    MeleeWeaponDamageRand = 0; // 武器伤害随机值, 原数据中存在此字段
    MeleeWeaponDamageMax = 0; // 最高武器伤害, 原数据中并无此字段, 为便于输入设立
    // MeleeWeaponDamageMax 需要额外的处理计算 ( = MeleeWeaponDamage + MeleeWeaponDamageRand)
}

export class DataInput {
    player = "焚影圣诀";
    delayNetwork = 45;
    delayKeyboard = 20;
    fightTime = 300;
    fightCount = 100;
    attribute = {
        method: "从数据导入",
        data: new DataAttribute(),
    };
    effects = ["大附魔·腰", "大附魔·腕", "大附魔·鞋", "家园酒·加速", "套装·技能", "套装·特效"];
    custom?: {
        fight: {
            method: string;
            data: string | string[];
        };
    };
}
