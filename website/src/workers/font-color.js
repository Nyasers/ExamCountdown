import { calculateBrightness, calculateContrastRatio, hexToRgbArray, rgbArrayToHex } from "./color.js";

export function getFontColor(hexcolor) {
    return getContrastYIQ(hexcolor);
}

const BLACK = "#000000";
const WHITE = "#FFFFFF";

const colorOptions = [
    BLACK, WHITE
];

function getContrastRatio(hexcolor) {
    let bestContrastColor = colorOptions[0];
    let maxContrastRatio = 0;
    for (let option of colorOptions) {
        const contrastRatio = calculateContrastRatio(hexcolor, option);
        if (contrastRatio > maxContrastRatio) {
            maxContrastRatio = contrastRatio;
            bestContrastColor = option;
        }
    }
    return bestContrastColor;
}

function getContrast50(hexcolor) {
    var rgb = hexToRgbArray(hexcolor);
    var hex = rgbArrayToHex(rgb).slice(1);
    return (parseInt(hex, 16) > 0xffffff / 2) ? BLACK : WHITE;
}

function getContrastYIQ(hexcolor) {
    var yiq = calculateBrightness(hexcolor);
    return (yiq >= 128) ? BLACK : WHITE;
}
