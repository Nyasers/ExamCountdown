function padz(str, len) {
    if (len === void 0) { len = 2; }
    return (new Array(len).join('0') + str).slice(-len);
}

function hexToRgbArray(hex) {
    if (hex.slice(0, 1) === '#')
        hex = hex.slice(1);
    var RE_HEX = /^(?:[0-9a-f]{3}){1,2}$/i;
    if (!RE_HEX.test(hex))
        throw new Error("Invalid HEX color: \"" + hex + "\"");
    // normalize / convert 3-chars hex to 6-chars.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16) // b
    ];
}

function getContrast50(hexcolor) {
    var rgb = hexToRgbArray(hexcolor);
    var hex = rgbArrayToHex(rgb).slice(1);
    return (parseInt(hex, 16) > 0xffffff / 2) ? 'black' : 'white';
}

function getContrastYIQ(hexcolor) {
    var rgb = hexToRgbArray(hexcolor);
    var r = rgb[0], g = rgb[1], b = rgb[2];
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

export function getContrast(hexcolor) {
    return getContrastYIQ(hexcolor);
}

export function rgbArrayToHex(rgb) {
    return '#' + rgb.map(function (c) { return padz((255 - c).toString(16)); }).join('');
}

export async function getAverageColor(colors) {
    var sum = [0, 0, 0], res = [0, 0, 0];
    colors.forEach(c => {
        for (let i = 0; i < 3; i++) {
            sum[i] += Number(c[i]);
        }
    });
    for (let i = 0; i < 3; i++) {
        res[i] = (sum[i] / colors.length).toFixed();
    }
    return res;
}
