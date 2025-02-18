const loader = WORKERS['image-loader'];
const ImageLoaderWorker = new Worker(URL.createObjectURL(new Blob([loader])));

ImageLoaderWorker.addEventListener('message', event => {
    const imageData = event.data;
    imageData.objectURL = imageData.imageURL.startsWith('blob:') ? imageData.imageURL : URL.createObjectURL(imageData.blob);
    applyImage(imageData);
})

async function applyImage(imageData) {
    if (!imageData.imageURL.startsWith('file:///') || !imageData.imageURL.startsWith('blob:')) setBackground(imageData.objectURL);
    await (async (imageData) => {
        let applyThemeColorBinded = applyThemeColor.bind(imageData);
        delete globalThis.applyThemeColor;
        globalThis.applyThemeColor = applyThemeColorBinded;
        applyThemeColorBinded();
    })(imageData);

    function applyThemeColor(index = 0) {
        const themeColor = (this.themeColors?.length > 0) ?
            this.themeColors[index]
            : "#ffffff";
        const fontColor = (ec.properties.autocolor.value && this.fontColors?.length > 0) ?
            getMostFrequentElement(this.fontColors)// this.fontColors[index]
            : ec.properties.fontcolor.value;
        console.log(this.themeColors, themeColor, this.fontColors, fontColor);
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
    if (typeof loader === 'undefined' || url.startsWith('file:///') || url.startsWith('blob:')) setBackground(url);
    ImageLoaderWorker.postMessage(url);
    return url;
}

function getMostFrequentElement(arr) {
    const frequencyMap = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    return Object.keys(frequencyMap).reduce((a, b) => {
        if (frequencyMap[a] > frequencyMap[b]) {
            return a;
        } else if (frequencyMap[a] < frequencyMap[b]) {
            return b;
        } else {
            return a > b ? a : b;
        }
    });
}
