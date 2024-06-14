import fetchBW from "./bing-wallpaper.js";

export function init(ec) {
    ec.plugin.bingWallpaper = {
        fetch: fetchBW.bind(),
    }
}