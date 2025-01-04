const loader = WORKERS['image-loader'];
const ImageLoaderWorker = new Worker(URL.createObjectURL(new Blob([loader])));

ImageLoaderWorker.addEventListener('message', event => {
    const imageData = event.data;
    imageData.objectURL = URL.createObjectURL(imageData.blob);
    applyImage(imageData);
})

async function applyImage(imageData) {
    if (!imageData.imageURL.startsWith('file:///')) setBackground(imageData.objectURL);
    await (async (imageData) => {
        let applyThemeColorBinded = applyThemeColor.bind(imageData);
        delete globalThis.applyThemeColor;
        globalThis.applyThemeColor = applyThemeColorBinded;
        applyThemeColorBinded();
    })(imageData);

    function applyThemeColor(index = 0) {
        const themeColor = (this.themeColors?.length > 0) ? this.themeColors[index] : "#ffffff";
        const fontColor = (this.fontColors?.length > 0) ? this.fontColors[index] : "#000000";
        console.log(this.themeColors, this.fontColors, index);
        setColors(themeColor, fontColor);
    }
}

function setBackground(url) {
    document.body.style.backgroundImage = `url(${url})`;
}

function setColors(themeColor, fontColor) {
    document.documentElement.style.setProperty('--themeColor', themeColor);
    document.documentElement.style.setProperty('--fontColor', fontColor);
}

export default function applyImageUrl(url) {
    if (typeof loader === 'undefined' || url.startsWith('file:///')) setBackground(url);
    ImageLoaderWorker.postMessage(url);
    return url;
}
