import Vec2 from "../utils/vector2d";
import Drawable from "./drawable";

export default class Group implements Drawable {
    public  name: string;
    public  topLeftCorner: Vec2;
    public  bottomRightCorner: Vec2;
    public  isSelected: boolean;
    private objects: Array<Drawable>;
    public  type: string | undefined;

    constructor(name: string, objects: Array<Drawable>) {
        this.name = name;
        this.isSelected = false;
        this.type = this.constructor.name;
        this.topLeftCorner = new Vec2(0, 0);
        this.bottomRightCorner = new Vec2(20, 20);
        this.objects = new Array<Drawable>();

        for (const object of objects) {
            object.setIsSelected = false;
            this.objects.push(object);
        }
    }

    set setIsSelected(val: boolean) {
        this.isSelected = val;
        for (const shape of this.objects) {
            shape.setIsSelected = val;
        }
    }

    get getShapes() {
        return this.objects;
    }

    isInRectangle(rectPoint1: Vec2, rectPoint2: Vec2): boolean {
        for (const shape of this.objects) {
            if (!shape.isInRectangle(rectPoint1, rectPoint2)) return false;
        }
        return true;
    }
    translate(deltaDist: Vec2): void {
        this.objects.forEach(shape => shape.translate(deltaDist));
    }
    rotate(angle: number): void {
        this.objects.forEach(shape => shape.rotate(angle));
    }
    resize(sizeCoeff: number, pos: Vec2): void {
        this.objects.forEach(shape => shape.resize(sizeCoeff, pos));
    }
    renderSelf(ctx: CanvasRenderingContext2D): void {
        this.objects.forEach(shape => shape.renderSelf(ctx));
    }
    renderNodes(ctx: CanvasRenderingContext2D): void {
        this.objects.forEach(shape => shape.renderNodes(ctx));
    }
}