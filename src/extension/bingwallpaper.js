const $ = globalThis.$;
// import { $ } from 'jquery';https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main/data/zh-CN_update.json
function fetchAndApply() {
$.getJSON('https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main/data/zh-CN_update.json')
    .then((data) => {
        console.log(data);
        let url = data.images[0].url;
        document.body.style.backgroundImage = `url('${url}')`;
    });
}

export default fetchAndApply;