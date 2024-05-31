import { themeColor } from "../themecolor.js"

self.addEventListener('message', async event => {
    const imageURL = event.data

    const response = await fetch(imageURL)
    const blob = await response.blob()

    const themeColors = await themeColor(blob)

    // Send the image data to the UI thread!
    self.postMessage({
        imageURL: imageURL,
        blob: blob,
        themeColors: themeColors,
    })
})