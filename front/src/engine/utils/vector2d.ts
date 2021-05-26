import { fastRounding } from "./math";

export default class Vec2 {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get arrCoords() {
        return [this.x, this.y];
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
    public static copyFrom(v2d: Vec2) {
        return new Vec2(v2d.x, v2d.y);
    }

    // basic math operations

    /**
     * Subtracts a vector from a vector
     * @param v2d1 first vector
     * @param v2d2 second vector
     */
    public subtract(v2d: Vec2): Vec2 {
        return new Vec2(this.x - v2d.x, this.y - v2d.y);
    }

    public add(v2d: Vec2) {
        return new Vec2(this.x + v2d.x, this.y + v2d.y);
    }

    // scalar operations

    public multiply(coeff: number): Vec2 {
        return new Vec2(this.x * coeff, this.y * coeff);
    }

    public divide(coeff: number): Vec2 {
        return new Vec2(this.x / coeff, this.y / coeff);
    }

    public static dot(v2d1: Vec2, v2d2: Vec2): number {
        return v2d1.x * v2d2.x + v2d1.y * v2d2.y;
    }

    // some nice things

    public static abs(v2d: Vec2) {
        return new Vec2(Math.abs(v2d.x), Math.abs(v2d.y));
    }

    public ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
    }

    public floor() {
        this.x = ~~this.x;
        this.y = ~~this.y;
    }

    public round() {
        this.x = fastRounding(this.x);
        this.y = fastRounding(this.y);
    }

    public equals(v2d: Vec2): boolean {
        return this.x == fastRounding(v2d.x) && this.y == fastRounding(v2d.y);
    }

    toString(): string {
        return `x: ${this.x}, y: ${this.y}`;
    }
} 