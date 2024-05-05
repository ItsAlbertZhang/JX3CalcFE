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
        isExp: boolean;
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

export interface Talent {
    skillID: number;
    name: string;
    iconID: number;
}

export interface DataAttribute {
    Vitality: number;
    Strength: number;
    Agility: number;
    Spirit: number;
    Spunk: number;
    PhysicsAttackPowerBase: number;
    SolarAttackPowerBase: number;
    LunarAttackPowerBase: number;
    NeutralAttackPowerBase: number;
    PoisonAttackPowerBase: number;
    PhysicsCriticalStrike: number;
    SolarCriticalStrike: number;
    LunarCriticalStrike: number;
    NeutralCriticalStrike: number;
    PoisonCriticalStrike: number;
    PhysicsCriticalDamagePower: number;
    SolarCriticalDamagePower: number;
    LunarCriticalDamagePower: number;
    NeutralCriticalDamagePower: number;
    PoisonCriticalDamagePower: number;
    PhysicsOvercomeBase: number;
    SolarOvercomeBase: number;
    LunarOvercomeBase: number;
    NeutralOvercomeBase: number;
    PoisonOvercomeBase: number;
    SurplusValue: number;
    Strain: number;
    Haste: number;
    MeleeWeaponDamage: number; // 武器伤害基础值, 原数据中存在此字段
    MeleeWeaponDamageRand: number; // 武器伤害随机值, 原数据中存在此字段
    MeleeWeaponDamageMax: number; // 最高武器伤害, 原数据中并无此字段, 为便于输入设立
    // MeleeWeaponDamageMax 需要额外的处理计算 ( : MeleeWeaponDamage + MeleeWeaponDamageRand)
}

export interface DataInput {
    name: string;
    player: string;
    delayNetwork: number;
    delayKeyboard: number;
    fightTime: number;
    fightCount: number;
    attribute: {
        method: string;
        data: DataAttribute;
    };
    effects: {
        [key: string]: boolean | string;
    };
    fight: {
        method: string;
        data: string | string[] | number;
    };
    talents: number[];
    // recipe: number[];
}
