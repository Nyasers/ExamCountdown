const $ = globalThis.$;
// import { $ } from 'jquery';https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main/data/zh-CN_update.json
function fetchAndApply(index = 0) {
    $.getJSON(`https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main/data/zh-CN_${index > 7 ? 'all' : 'update'}.json`)
        .then((data) => {
            console.log(data);
            let origin = 'https://cn.bing.com';
            let urlbase = data[index > 7 ? 'data' : 'images'][index].urlbase;
            document.body.style.backgroundImage = `url('${origin + urlbase + '_UHD.jpg'}')`;
        });
}

export default fetchAndApply;