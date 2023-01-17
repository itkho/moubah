const formatter = Intl.NumberFormat("en", { notation: "compact" });

export function abbrNum(number: number) {
    return formatter.format(number);
}

export function cleanSrcPath(path: string) {
    if (path.startsWith("https://")) return path;
    return "file://" + path;
}
