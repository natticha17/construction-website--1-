export const HOUSE_TYPES = [
    "1 ชั้น",
    "1.5 ชั้น",
    "2 ชั้น"
] as const;

export const HOUSE_STYLES = [
    "Modern",
    "Contemporary"
] as const;

export type HouseType = typeof HOUSE_TYPES[number];
export type HouseStyle = typeof HOUSE_STYLES[number];
