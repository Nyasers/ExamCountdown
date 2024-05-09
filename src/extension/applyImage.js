import { getAverageColor } from "./color.js";
import { getContrast, rgbArrayToHex } from "./color.js";
import { themeColor } from "./themecolor.js";

export async function applyImage(img) {
    themeColor(img, async (themeColors) => {
        var colors = [themeColors[5], themeColors[6]];
        let aveColor = await getAverageColor(colors);
        setColors(aveColor);
        let url = img.src;
        document.body.style.backgroundImage = `url(${url})`;
    });
}

async function setColors(themeColorRgbArray) {
    let themeColor = rgbArrayToHex(themeColorRgbArray);
    document.documentElement.style.setProperty('--themeColor', themeColor);

    let fontColor = getContrast(themeColor);
    document.documentElement.style.setProperty('--fontColor', fontColor);
}
