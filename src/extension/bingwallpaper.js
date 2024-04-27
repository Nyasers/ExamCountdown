const $ = globalThis.$;
const api = 'https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main';
const bing = 'https://cn.bing.com'; //s.cn.bing.net

async function getURLBase(index = 0) {
    const data = await $.getJSON(`${api}/data/zh-CN_${index > 7 ? 'all' : 'update'}.json`)
    console.log(index + 1, data.length);
    if (index + 1 > data.length)
        throw new Error(`Trying to get the ${index + 1} from ${data.length} elements.`);
    let image = data[index > 7 ? 'data' : 'images'][index];
    return bing + image.urlbase;
}

async function fetchBW(index = 0, ext = 'UHD.jpg') {
    const url = `${await getURLBase(index)}_${ext}`;
    const preloader = new Image();
    preloader.onload = () =>
        document.body.style.backgroundImage = `url(${url})`;
    preloader.src = url;
    console.log(preloader);
}

export default fetchBW;