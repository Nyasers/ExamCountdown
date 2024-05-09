import { getAverageColor } from "./color.js";
import { getContrast, rgbArrayToHex } from "./color.js";
import { themeColor } from "./themecolor.js";

function getThemeColor(img) {
    themeColor(img, async (themeColors) => {
        var colors = [themeColors[5], themeColors[6]];
        let aveColor = await getAverageColor(colors);
        self.postMessage(aveColor);
    });
}

var blob = new Blob([`self.addEventListener('message', ${getThemeColor.toString()}, false);`]);
var url = URL.createObjectURL(blob);
console.log(url);

async function applyImage(img) {
    document.body.style.backgroundImage = `url(${img.src})`;
    var worker = new Worker(url);
    worker.addEventListener('message', function (color) {
        setColors(color);
        worker.terminate();
    })
    worker.postMessage(img);
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
