import { getAverageColor } from "./color.js";
import { getContrast, rgbArrayToHex } from "./color.js";
import { themeColor } from "./themecolor.js";
import ImageLoaderWorker from './workers/image-loader.worker.js'

const imageLoader = new ImageLoaderWorker

ImageLoaderWorker.addEventListener('message', event => {
    const imageData = event.data
    const objectURL = URL.createObjectURL(imageData.blob)
    console.log({ objectURL })
})

async function applyImage(img) {
    document.body.style.backgroundImage = `url(${img.src})`;
    if (img.src != ec.background.default) setTimeout(() => themeColor(img, async (themeColors) => {
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
    let preloader = new Image();
    preloader.onload = async () => await applyImage(preloader);
    preloader.src = url;
    preloader.setAttribute('crossOrigin', '');
}
