import { US, FR, AR } from "country-flag-icons/react/3x2";
import { Locale } from "./enums";

const formatter = Intl.NumberFormat("en", { notation: "compact" });

export function abbrNum(number: number) {
    return formatter.format(number);
}

export function cleanSrcPath(path: string) {
    if (path.startsWith("https://")) return path;
    return "file://" + path;
}

export function langFromLocale(locale: Locale) {
    switch (locale) {
        case Locale.en:
            return "English";
        case Locale.fr:
            return "Français";
        case Locale.ar:
            return "العربية";
        default:
            Error("Language not supported");
    }
}
