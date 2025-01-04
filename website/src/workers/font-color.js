// 从指定颜色数组中选择 fontColor
const colorOptions = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF"];
export function getFontColor(themeColor) {
    return getContrastingColor(themeColor);
}
function getContrastingColor(color) {
    let bestContrastColor = colorOptions[0];
    let maxContrastRatio = 0;
    for (let option of colorOptions) {
        const optionRgb = hexToRgb(option);
        const contrastRatio = calculateContrastRatio(color, [optionRgb.r, optionRgb.g, optionRgb.b]);
        if (contrastRatio > maxContrastRatio) {
            maxContrastRatio = contrastRatio;
            bestContrastColor = option;
        }
    }
    return bestContrastColor;
}
function hexToRgb(hex) {
    // 将十六进制颜色转换为 RGB
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: (bigint & 255)
    };
}
function calculateBrightness(color) {
    return (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
}
function calculateContrastRatio(color1, color2) {
    const brightness1 = calculateBrightness(color1);
    const brightness2 = calculateBrightness(color2);
    const lighter = Math.max(brightness1, brightness2);
    const darker = Math.min(brightness1, brightness2);
    return (lighter + 0.05) / (darker + 0.05);
}
