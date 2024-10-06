export const PILLS: Record<string, string> = {
    "SL1": "assets/pills/sl1.svg",
    "SL2": "assets/pills/sl2.svg",
    "SL3": "assets/pills/sl3.svg",
    "SL4": "assets/pills/sl4.svg",
    "SL5": "assets/pills/sl5.svg",
    "WALK": "assets/pills/walk.svg",
    "MASSPORT33": "assets/pills/massport33.svg",
};


export const COMPLETION = (is_complete: boolean): string => {
    if (is_complete) {
        return "assets/icons/stop_complete.svg";
    } else {
        return "assets/icons/stop_incomplete.svg";
    }
};
