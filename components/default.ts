import { DataInput } from "@/components/definitions";

export const defaultDataInput: DataInput = {
    name: "基准页",
    player: "焚影圣诀",
    delayNetwork: 45,
    delayKeyboard: 20,
    fightTime: 300,
    fightCount: 100,
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

export const defaultTalent: number[] = [
    5972, // 腾焰飞芒
    18279, // 净身明礼
    22888, // 诛邪镇魔
    6717, // 无明业火
    34383, // 明光恒照
    34395, // 日月同辉
    34372, // 靡业报劫
    17567, // 用晦而明
    25166, // 净体不畏
    34378, // 降灵尊
    34347, // 悬象著明 (主动)
    34370, // 日月齐光
    // 37337, // 崇光斩恶
];
