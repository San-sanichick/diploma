import Vec2 from "../utils/vector2d";
import Drawable from "./drawable";

export default class Group implements Drawable {
    public  name: string;
    public  topLeftCorner: Vec2;
    public  bottomRightCorner: Vec2;
    public  isSelected: boolean;
    private shapes: Array<Drawable>;
    public  type: string | undefined;

    constructor(name: string, shapes: Array<Drawable>) {
        this.name = name;
        this.isSelected = false;
        this.type = this.constructor.name;
        this.topLeftCorner = new Vec2(0, 0);
        this.bottomRightCorner = new Vec2(20, 20);
        this.shapes = new Array<Drawable>();

        for (const shape of shapes) {
            shape.isSelected = false;
            this.shapes.push(shape);
        }
    }

    set setIsSelected(val: boolean) {
        this.isSelected = val;
        for (const shape of this.shapes) {
            shape.setIsSelected = val;
        }
    }

    get getShapes() {
        return this.shapes;
    }

    isInRectangle(rectPoint1: Vec2, rectPoint2: Vec2): boolean {
        for (const shape of this.shapes) {
            if (!shape.isInRectangle(rectPoint1, rectPoint2)) return false;
        }
        return true;
    }
    translate(deltaDist: Vec2): void {
        this.shapes.forEach(shape => shape.translate(deltaDist));
    }
    rotate(angle: number): void {
        this.shapes.forEach(shape => shape.rotate(angle));
    }
    resize(sizeCoeff: number, pos: Vec2): void {
        this.shapes.forEach(shape => shape.resize(sizeCoeff, pos));
    }
    renderSelf(ctx: CanvasRenderingContext2D): void {
        this.shapes.forEach(shape => shape.renderSelf(ctx));
    }
    renderNodes(ctx: CanvasRenderingContext2D): void {
        this.shapes.forEach(shape => shape.renderNodes(ctx));
    }
}