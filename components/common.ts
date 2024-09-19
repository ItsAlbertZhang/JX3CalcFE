interface KungfuAttribute {
    atKungfuAttr: string[];
    atAttackPowerBase: string[];
    atCriticalStrike: string[];
    atCriticalDamagePower: string[];
    atOvercomeBase: string[];
}

export const kungfuAttribute: {
    [key: string]: KungfuAttribute;
} = {
    焚影圣诀: {
        atKungfuAttr: ["Spunk"],
        atAttackPowerBase: ["SolarAttackPowerBase", "LunarAttackPowerBase"],
        atCriticalStrike: ["SolarCriticalStrike", "LunarCriticalStrike"],
        atCriticalDamagePower: ["SolarCriticalDamagePower", "LunarCriticalDamagePower"],
        atOvercomeBase: ["SolarOvercomeBase", "LunarOvercomeBase"],
    },
};
