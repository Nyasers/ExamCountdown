import { getAverageColor, getContrast, rgbArrayToHex } from "./color.js";

var blob = new Blob([WORKERS['image-loader']]);
const ImageLoaderWorker = new Worker(URL.createObjectURL(blob));

ImageLoaderWorker.addEventListener('message', event => {
    const imageData = event.data;
    imageData.objectURL = URL.createObjectURL(imageData.blob);
    applyImage(imageData);
})

async function applyImage(imageData) {
    setBackground(imageData.objectURL);
    await (async (themeColors) => {
        delete globalThis.theme; 
        globalThis.theme = (function (i) { setColors(themeColors[i]) }).bind();
        let colors = [themeColors[themeColors.length - 3], themeColors[themeColors.length - 2]];
        let aveColor = await getAverageColor(colors);
        await setColors(aveColor);
    })(imageData.themeColors);
}

function setBackground(url) {
    document.body.style.backgroundImage = `url(${url})`;
}

async function setColors(themeColorRgbArray) {
    let themeColor = rgbArrayToHex(themeColorRgbArray);
    document.documentElement.style.setProperty('--themeColor', themeColor);

    let fontColor = getContrast(themeColor);
    document.documentElement.style.setProperty('--fontColor', fontColor);
}

export default function applyImageUrl(url) {
    if (url.startsWith('file:///')) setBackground(url);
    ImageLoaderWorker.postMessage(url);
}
