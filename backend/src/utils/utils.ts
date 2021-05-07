export let getToken = (headers: any) => {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if  (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function decodeBase64Image(dataString: string) {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (matches === null || matches.length !== 3) {
        throw new Error("Invalid string");
    }

    return {
        type: matches[1],
        data: Buffer.from(matches[2], "base64")
    }
}