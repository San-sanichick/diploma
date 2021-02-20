export default class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Calculates magnitude
     * @returns magnitude, duh
     */
    public mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Creates a copy of a given vector
     * @param v2d An instance of a Vector2D to copy from
     */
    public static copyFrom(v2d: Vector2D) {
        return new Vector2D(v2d.x, v2d.y);
    }

    /**
     * Subtracts a vector from a vector
     * @param v2d1 first vector
     * @param v2d2 second vector
     */
    public static subtract(v2d1: Vector2D, v2d2: Vector2D): Vector2D {
        return new Vector2D(v2d1.x - v2d2.x, v2d1.y - v2d2.y);
    }
}