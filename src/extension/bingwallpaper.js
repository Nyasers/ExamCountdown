import { getContrastYIQ, rgbArrayToHex } from "./color.js";

const $ = globalThis.$;
const api = 'https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main';
const bing = 'https://cn.bing.com'; //s.cn.bing.net

async function getURLBase(index = 0) {
    const data = await $.getJSON(`${api}/data/zh-CN_${index > 7 ? 'all' : 'update'}.json?_=${new Date().getTime()}`)
    const images = data[index > 7 ? 'data' : 'images'];
    if (index >= images.length)
        throw new Error(`Trying to get the ${index + 1} from ${images.length} elements.`);
    let image = images[index];
    return bing + image.urlbase;
}

async function fetchBW(index = 0, ext = 'UHD.jpg') {
    const url = `${await getURLBase(index)}_${ext}`;
    const preloader = new Image();
    preloader.onload = async () => await applyImage(preloader);
    preloader.src = url;
    preloader.setAttribute('crossOrigin', '');
    console.log(preloader);
}

async function applyImage(img) {
    globalThis.themeColor(img, async (themeColors) => {
        console.log(themeColors);
        // globalThis.debug_setColors = async (index) => await setColors(themeColors[index]);
        let aveColor = await getAverageColor(themeColors);
        console.log(aveColor);
        setColors(aveColor);
        let url = img.src;
        document.body.style.backgroundImage = `url(${url})`;
    })
}

async function getAverageColor(themeColors) {
    var colors = [themeColors[5], themeColors[6]];
    var len = colors.length;
    var sum = [0, 0, 0];
    var res = [0, 0, 0];
    colors.forEach(e => {
        for (let i = 0; i < e.length; i++) {
            sum[i] += Number(e[i]);
        }
    });
    for (let i = 0; i < sum.length; i++) {
        res[i] = (sum[i] / len).toFixed();
    }
    return res;
}

async function setColors(themeColorRgbArray) {
    let themeColor = rgbArrayToHex(themeColorRgbArray);
    console.log(themeColor);
    document.documentElement.style.setProperty('--themeColor', themeColor);

    let fontColor = getContrastYIQ(themeColor);
    console.log(fontColor);
    document.documentElement.style.setProperty('--fontColor', fontColor);
}

export default fetchBW;