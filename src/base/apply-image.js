import { getAverageColor, getContrast, rgbArrayToHex } from "./color.js";

const ImageLoaderWorker = new Worker(URL.createObjectURL(`
import { themeColor } from "./themecolor.js";

self.addEventListener('message', async event => {
    const imageURL = event.data;

    const response = await fetch(imageURL);
    const blob = await response.blob();

    const themeColors = await themeColor(blob);

    self.postMessage({
        blob: blob,
        imageURL: imageURL,
        themeColors: themeColors,
    });
});
`));
//const ImageLoaderWorker = new Worker(new URL('./workers/image-loader.worker.js', import.meta.url));

ImageLoaderWorker.addEventListener('message', event => {
    const imageData = event.data;
    imageData.objectURL = URL.createObjectURL(imageData.blob);
    applyImage(imageData);
})

async function applyImage(imageData) {
    document.body.style.backgroundImage = `url(${imageData.objectURL})`;
    if (imageData.imageURL != ec.background.default)
        await (async (themeColors) => {
            let colors = [themeColors[themeColors.length - 3], themeColors[themeColors.length - 2]];
            let aveColor = await getAverageColor(colors);
            await setColors(aveColor);
        })(imageData.themeColors);
}

async function setColors(themeColorRgbArray) {
    let themeColor = rgbArrayToHex(themeColorRgbArray);
    document.documentElement.style.setProperty('--themeColor', themeColor);

    let fontColor = getContrast(themeColor);
    document.documentElement.style.setProperty('--fontColor', fontColor);
}

export default function applyImageUrl(url) {
    ImageLoaderWorker.postMessage(url);
}
