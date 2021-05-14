function RGBToHEX(rgba: string): string {
    const colors = rgba.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

    const hex = `#${((1 << 24) + (parseInt(colors[0]) << 16) + (parseInt(colors[1]) << 8) + parseInt(colors[2])).toString(16).slice(1)}`;
    return hex;
}

function padZero(str: string, len?: number) {
    len = len || 2;
    const zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

export function invertHex(hex: string) {
    let newHex = hex;
    if (hex.includes("rgba")) newHex = RGBToHEX(hex);
    if (newHex.indexOf('#') === 0) {
        newHex = newHex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (newHex.length === 3) {
        newHex = newHex[0] + newHex[0] + newHex[1] + newHex[1] + newHex[2] + newHex[2];
    }
    if (newHex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    const r = (255 - parseInt(newHex.slice(0, 2), 16)).toString(16),
          g = (255 - parseInt(newHex.slice(2, 4), 16)).toString(16),
          b = (255 - parseInt(newHex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}