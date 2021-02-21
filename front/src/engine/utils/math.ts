function mapRange(val: number, valRangeStart: number, valRangeEnd: number, newRangeStart: number, newRangeEnd: number): number {
    return newRangeStart + ((newRangeEnd - newRangeStart) / (valRangeStart - valRangeEnd)) * (val - valRangeStart);
}

function clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
}

export { clamp, mapRange }