const formatter = Intl.NumberFormat("en", { notation: "compact" });

export function abbrNum(number: number) {
    return formatter.format(number);
}
