/**
 * Maps a given value's range onto a new range
 * @param val A value
 * @param valRangeStart Value's minimum possible value
 * @param valRangeEnd Value's maximum possible value
 * @param newRangeStart Value's new minimum possible value
 * @param newRangeEnd Value's new maximum possible value
 */
function mapRange(val: number, valRangeStart: number, valRangeEnd: number, newRangeStart: number, newRangeEnd: number): number {
    return newRangeStart + ((newRangeEnd - newRangeStart) / (valRangeStart - valRangeEnd)) * (val - valRangeStart);
}

/**
 * Clamps a given value in a range, defined by a minimum and a maximum
 * @param val A value to be clamped
 * @param min Minimal of the range
 * @param max Maximum of the range
 */
function clamp(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max);
}

/**
 * Rounds a given value. The performance gain is probably
 * most surely negligible, but hey, it looks cool 
 * @param val Number to be rounded
 */
function fastRounding(val: number): number {
    return (val + (val > 0 ? 0.5 : -0.5)) << 0;
}

export { clamp, mapRange, fastRounding }