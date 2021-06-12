import DXFWriter from "@tarikjabiri/dxf";
import { fastRounding } from "../utils/math";
import Vec2 from "../utils/vector2d";
import Drawable from "./drawable";
import { ShapeIcons } from "@/utils/images";

/**
 * Group class, represents a collection of shapes.
 * 
 * So, fun story, out of all CADs that I researched, only AutoCAD seemingly has the
 * ability to GROUP entities. Every other one just says to use BLOCKs.
 * Sooo, uhh, yea, that's an oversight by me, but blocks are considerably more complicated
 * feature to implement, especially given the current state of this codebase, so screw that,
 * we have our own proprietery entity boiz
 */
export default class Group implements Drawable {
    public  name: string;
    public  icon: string;
    public  topLeftCorner: Vec2;
    public  bottomRightCorner: Vec2;
    public  isSelected: boolean;
    private objects: Array<Drawable>;
    public  type: string | undefined;

    constructor(name: string, objects: Array<Drawable>) {
        this.name = name;
        this.icon = ShapeIcons.GroupIcon;
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
    
    vertices?: number | undefined;

    toDXF(drw: DXFWriter): void {
        // throw new Error("Method not implemented.");
        drw.addLayer(this.name, DXFWriter.colors.White, "CONTINUOS");
        drw.setCurrentLayer(this.name);
        this.objects.forEach(obj => obj.toDXF(drw));
    }
    
    get centerOfShape(): Vec2 {
        let sumX = 0,
            sumY = 0;
        for (const obj of this.objects) {
            sumX += obj.centerOfShape.x;
            sumY += obj.centerOfShape.y;
        }

        sumX /= this.objects.length;
        sumY /= this.objects.length;

        return new Vec2(fastRounding(sumX), fastRounding(sumY));
    }

    set setIsSelected(val: boolean) {
        this.isSelected = val;
        for (const shape of this.objects) {
            shape.setIsSelected = val;
        }
    }

    get getObjects() {
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
    rotate(angle: number, pos: Vec2): void {
        this.objects.forEach(shape => shape.rotate(angle, pos));
    }
    resize(sizeCoeff: number, pos: Vec2): void {
        this.objects.forEach(shape => shape.resize(sizeCoeff, pos));
    }
    renderSelf(ctx: CanvasRenderingContext2D, color?: string): void {
        this.objects.forEach(shape => shape.renderSelf(ctx, color));
    }
    renderNodes(ctx: CanvasRenderingContext2D): void {
        this.objects.forEach(shape => shape.renderNodes(ctx));
    }
}