import { getAverageColor, getContrast, rgbArrayToHex } from "./color.js";

const ImageLoaderWorker = new Worker(URL.createObjectURL(new Blob([WORKERS['image-loader']])));

ImageLoaderWorker.addEventListener('message', event => {
    const imageData = event.data;
    imageData.objectURL = URL.createObjectURL(imageData.blob);
    applyImage(imageData);
})

async function applyImage(imageData) {
    if (!imageData.imageURL.startsWith('file:///')) setBackground(imageData.objectURL);
    await (async (themeColors) => {
        let applyThemeColorBinded = applyThemeColor.bind({ themeColors: themeColors });
        delete globalThis.applyThemeColor;
        globalThis.applyThemeColor = applyThemeColorBinded;
        await applyThemeColorBinded();
    })(imageData.themeColors);

    async function applyThemeColor(index = 0) {
        let colors = [];
        if (typeof index == typeof 0) colors = colors.concat([this.themeColors[index]]);
        if (typeof index == typeof [0]) index.forEach(i => {
            colors = colors.concat([this.themeColors[i]]);
        });
        let aveColor = await getAverageColor(colors);
        await setColors(aveColor);
    }
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
