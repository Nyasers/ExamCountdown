export function calculateBrightness(hexcolor) {
    const color = hexToRgbArray(hexcolor)
    return (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000
}

export function calculateContrastRatio(color1, color2) {
    const brightness1 = calculateBrightness(color1) / 255
    const brightness2 = calculateBrightness(color2) / 255
    const lighter = Math.max(brightness1, brightness2)
    const darker = Math.min(brightness1, brightness2)
    return (lighter + 0.05) / (darker + 0.05)
}

export function hexToRgb(hex) {
    // 将十六进制颜色转换为 RGB
    const bigint = parseInt(hex.slice(1), 16)
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: (bigint & 255)
    }
}

export function hexToRgbArray(hex) {
    if (hex.slice(0, 1) === '#')
        hex = hex.slice(1)
    var RE_HEX = /^(?:[0-9a-f]{3}){1,2}$/i
    if (!RE_HEX.test(hex))
        throw new Error("Invalid HEX color: \"" + hex + "\"")
    // normalize / convert 3-chars hex to 6-chars.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16) // b
    ]
}

export function rgbArrayToHex(color) {
    return `#${color.map(c => padz((255 - c).toString(16))).join('')}`
}

export function padz(str, len) {
    if (len === void 0) { len = 2; }
    return (new Array(len).join('0') + str).slice(-len)
}

export function getAverageColor(colors) {
    var sum = [0, 0, 0], res = [0, 0, 0]
    colors.forEach(c => {
        for (let i = 0; i < 3; i++) {
            sum[i] += Number(c[i])
        }
    })
    for (let i = 0; i < 3; i++) {
        res[i] = (sum[i] / colors.length).toFixed()
    }
    return res
}

