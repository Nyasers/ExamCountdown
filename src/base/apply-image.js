import { getAverageColor, getContrast, rgbArrayToHex } from "./color.js";

const _ImageLoaderWorker = new Worker(new URL('./workers/image-loader.worker.js', import.meta.url));
var blob = new Blob([document.querySelector('script#image-loader').textContent]);
const ImageLoaderWorker = new Worker(URL.createObjectURL(blob));

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
