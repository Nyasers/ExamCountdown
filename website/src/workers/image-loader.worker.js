import { getFontColor } from "./font-color.js";
import { getThemeColor } from "./theme-color.js";

self.addEventListener('message', async event => {
    const imageURL = event.data;

    const response = await fetch(imageURL);
    const blob = await response.blob();

    const result = await getThemeColor(blob);
    var themeColors = [];
    var fontColors = [];
    for (let color of result) {
        themeColors.push(calculateHexColor(color));
        fontColors.push(getFontColor(color));
    }

    self.postMessage({
        blob: blob,
        imageURL: imageURL,
        themeColors: themeColors,
        fontColors: fontColors,
    });
});

function padz(str, len) {
    if (len === void 0) { len = 2; }
    return (new Array(len).join('0') + str).slice(-len);
}

function calculateHexColor(color) {
    return `#${color.map(function (c) { return padz((255 - c).toString(16)); }).join('')}`;
}