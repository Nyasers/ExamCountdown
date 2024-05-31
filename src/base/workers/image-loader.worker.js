import { themeColor } from "../theme-color.js";

self.addEventListener('message', async event => {
    const imageURL = event.data;

    const response = await fetch(imageURL);
    const blob = await response.blob();

    const themeColors = await themeColor(blob);

    self.postMessage({
        blob: blob,
        imageURL: imageURL,
        themeColors: themeColors,
    });
});