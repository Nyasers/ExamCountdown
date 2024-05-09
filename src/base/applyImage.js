import { getAverageColor } from "./color.js";
import { getContrast, rgbArrayToHex } from "./color.js";
import { themeColor } from "./themecolor.js";

async function getThemeColor(img) {
    themeColor(img, async (themeColors) => {
        var colors = [themeColors[5], themeColors[6]];
        let aveColor = await getAverageColor(colors);
        return aveColor;
    });
}

/*
var blob = new Blob([`self.addEventListener('message', ${getThemeColor.toString()}, false);`]);
var url = URL.createObjectURL(blob);
var worker = new Worker(url);
worker.addEventListener('message', function (color) {
    setColors(color);
    worker.terminate();
})
*/

async function applyImage(img) {
    document.body.style.backgroundImage = `url(${img.src})`;
    var themeColor = await getThemeColor(img);
    setColors(themeColor);
    //worker.postMessage(() => new Image(img));
}

async function setColors(themeColorRgbArray) {
    let themeColor = rgbArrayToHex(themeColorRgbArray);
    document.documentElement.style.setProperty('--themeColor', themeColor);

    let fontColor = getContrast(themeColor);
    document.documentElement.style.setProperty('--fontColor', fontColor);
}

export function applyImageUrl(url) {
    var preloader = new Image();
    preloader.onload = async () => await applyImage(preloader);
    preloader.src = url;
    preloader.setAttribute('crossOrigin', '');
}
