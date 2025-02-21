import { rgbArrayToHex } from "./color.js"
import { getFontColor } from "./font-color.js"
import { getThemeColor } from "./theme-color.js"

self.addEventListener('message', async event => {
    const imageURL = event.data

    const response = await fetch(imageURL)
    const blob = await response.blob()

    const result = await getThemeColor(blob)
    var themeColors = []
    var fontColors = []
    for (let color of result) {
        const hexcolor = rgbArrayToHex(color)
        const fontColor = getFontColor(hexcolor)
        themeColors.push(hexcolor)
        fontColors.push(fontColor)
    }

    self.postMessage({
        blob: blob,
        imageURL: imageURL,
        themeColors: themeColors,
        fontColors: fontColors,
    })
})

