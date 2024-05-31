import { getAverageColor, getContrast, rgbArrayToHex } from "./color.js";

const ImageLoaderWorker = new Worker(new URL('./workers/image-loader.worker.js', import.meta.url));

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

export function applyImageUrl(url) {
    ImageLoaderWorker.postMessage(url)
    /*let preloader = new Image();
    preloader.onload = async () => await applyImage(preloader);
    preloader.src = url;
    preloader.setAttribute('crossOrigin', '');*/
}
