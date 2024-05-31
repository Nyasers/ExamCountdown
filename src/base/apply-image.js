import { getAverageColor } from "./color.js";
import { getContrast, rgbArrayToHex } from "./color.js";
import { themeColor } from "./themecolor.js";

const ImageLoaderWorker = new Worker(new URL('./workers/image-loader.worker.js', import.meta.url));

ImageLoaderWorker.addEventListener('message', event => {
    const imageData = event.data
    applyImage(imageData);
})

async function applyImage(imageData) {
    const objectURL = URL.createObjectURL(imageData.blob);
    document.body.style.backgroundImage = `url(${objectURL})`;
    if (objectURL != ec.background.default)
        setTimeout(() => themeColor(imageData.blob, async (themeColors) => {
            let colors = [themeColors[themeColors.length - 3], themeColors[themeColors.length - 2]];
            let aveColor = await getAverageColor(colors);
            await setColors(aveColor);
        }), 1e3);
}

async function setColors(themeColorRgbArray) {
    let themeColor = rgbArrayToHex(themeColorRgbArray);
    document.documentElement.style.setProperty('--themeColor', themeColor);

    let fontColor = getContrast(themeColor);
    document.documentElement.style.setProperty('--fontColor', fontColor);
}

export function applyImageUrl(url) {
    ImageLoaderWorker.postMessage(url)
    /*let preloader = new Image();
    preloader.onload = async () => await applyImage(preloader);
    preloader.src = url;
    preloader.setAttribute('crossOrigin', '');*/
}
