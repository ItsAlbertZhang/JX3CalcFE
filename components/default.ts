import { DataInput } from "@/components/definitions";

export const defaultDataInput: DataInput = {
    name: "基准页",
    player: "焚影圣诀",
    delayNetwork: 45,
    delayKeyboard: 20,
    fightTime: 308,
    fightCount: 1000,
    attribute: {
        method: "从数据导入",
        data: {
            Vitality: 0,
            Strength: 0,
            Agility: 0,
            Spirit: 0,
            Spunk: 0,
            PhysicsAttackPowerBase: 0,
            SolarAttackPowerBase: 0,
            LunarAttackPowerBase: 0,
            NeutralAttackPowerBase: 0,
            PoisonAttackPowerBase: 0,
            PhysicsCriticalStrike: 0,
            SolarCriticalStrike: 0,
            LunarCriticalStrike: 0,
            NeutralCriticalStrike: 0,
            PoisonCriticalStrike: 0,
            PhysicsCriticalDamagePower: 0,
            SolarCriticalDamagePower: 0,
            LunarCriticalDamagePower: 0,
            NeutralCriticalDamagePower: 0,
            PoisonCriticalDamagePower: 0,
            PhysicsOvercomeBase: 0,
            SolarOvercomeBase: 0,
            LunarOvercomeBase: 0,
            NeutralOvercomeBase: 0,
            PoisonOvercomeBase: 0,
            SurplusValue: 0,
            Strain: 0,
            Haste: 0,
            MeleeWeaponDamage: 0,
            MeleeWeaponDamageRand: 0,
            MeleeWeaponDamageMax: 0,
        },
    },
    effects: ["大附魔·腰", "大附魔·腕", "大附魔·鞋", "家园酒·加速", "套装·技能", "套装·特效"],
};

// TODO: 使用后端数据
export interface Talent {
    skillID: number;
    name: string;
    iconID: number;
}

export const talentHd: Talent[][] = [
    [{ skillID: 5972, name: "腾焰飞芒", iconID: 3825 }],
    [{ skillID: 18279, name: "净身明礼", iconID: 3793 }],
    [
        { skillID: 22888, name: "诛邪镇魔", iconID: 11829 },
        { skillID: 5978, name: "洞若观火", iconID: 3837 },
    ],
    [{ skillID: 6717, name: "无明业火", iconID: 3836 }],
    [{ skillID: 34383, name: "明光恒照", iconID: 3825 }],
    [{ skillID: 34395, name: "日月同辉", iconID: 3834 }],
    [{ skillID: 34372, name: "靡业报劫", iconID: 19171 }],
    [{ skillID: 17567, name: "用晦而明", iconID: 3846 }],
    [{ skillID: 25166, name: "净体不畏", iconID: 14103 }],
    [{ skillID: 34378, name: "降灵尊", iconID: 7257 }],
    [{ skillID: 34347, name: "悬象著明", iconID: 19168 }],
    [{ skillID: 34370, name: "日月齐光", iconID: 7228 }],
];

export const talentExp: Talent[][] = [
    [{ skillID: 5972, name: "腾焰飞芒", iconID: 3825 }],
    [{ skillID: 18279, name: "净身明礼", iconID: 3793 }],
    [
        { skillID: 22888, name: "诛邪镇魔", iconID: 11829 },
        { skillID: 5978, name: "洞若观火", iconID: 3837 },
    ],
    [{ skillID: 6717, name: "无明业火", iconID: 3836 }],
    [{ skillID: 34383, name: "明光恒照", iconID: 3825 }],
    [{ skillID: 34395, name: "日月同辉", iconID: 3834 }],
    [{ skillID: 34372, name: "靡业报劫", iconID: 19171 }],
    [{ skillID: 17567, name: "用晦而明", iconID: 3846 }],
    [{ skillID: 25166, name: "净体不畏", iconID: 14103 }],
    [{ skillID: 34378, name: "降灵尊", iconID: 7257 }],
    [{ skillID: 34347, name: "悬象著明", iconID: 19168 }],
    [
        { skillID: 37337, name: "崇光斩恶", iconID: 21960 },
        { skillID: 34370, name: "日月齐光", iconID: 7228 },
    ],
];
