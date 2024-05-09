function hexToRgbArray(hex) {
    if (hex.slice(0, 1) === '#')
        hex = hex.slice(1);
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

export function getContrastYIQ(hexcolor){
    var rgb = hexToRgbArray(hexcolor);
    var yiq = ((rbg[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

export function rgbArrayToHex(rbg) {
    return '#' + rgb.map(function (c) { return padz((255 - c).toString(16)); }).join('');
}
