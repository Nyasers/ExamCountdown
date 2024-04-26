import { shouldUseURLPlugin } from "css-loader/dist/utils";

const $ = globalThis.$;
// import { $ } from 'jquery';https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main/data/zh-CN_update.json
function fetchAndApply(index = 0) {
    $.getJSON(`https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main/data/zh-CN_${index > 7 ? 'all' : 'update'}.json`)
        .then((data) => {
            console.log(data);
            let origin = 'https://cn.bing.com';
            let image = data[index > 7 ? 'data' : 'images'][index];
            console.log(image);
            let urlbase = image.urlbase;
            let url = origin + urlbase + '_UHD.jpg';
            console.log(url);
            document.body.style.backgroundImage = `url(${url})`;
        });
}

export default fetchAndApply;