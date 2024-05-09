import { $ } from 'jquery';

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
    setTimeout(async () => ec.background.set(url));
}

export default fetchBW;