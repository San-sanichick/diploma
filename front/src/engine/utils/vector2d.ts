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

    // basic math operations

    /**
     * Subtracts a vector from a vector
     * @param v2d1 first vector
     * @param v2d2 second vector
     */
    public subtract(v2d: Vector2D): Vector2D {
        return new Vector2D(this.x - v2d.x, this.y - v2d.y);
    }

    public add(v2d: Vector2D) {
        return new Vector2D(this.x + v2d.x, this.y + v2d.y);
    }

    // scalar operations

    public multiply(coeff: number): Vector2D {
        return new Vector2D(this.x * coeff, this.y * coeff);
    }

    public divide(coeff: number): Vector2D {
        return new Vector2D(this.x / coeff, this.y / coeff);
    }

    public static dot(v2d1: Vector2D, v2d2: Vector2D): number {
        return v2d1.x * v2d2.x + v2d1.y * v2d2.y;
    }

    // some nice things

    public ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
    }

    public floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }

    public round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }

    toString(): string {
        return `x: ${this.x}, y: ${this.y}`;
    }
} 