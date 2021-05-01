import Vec2 from "../utils/vector2d";
import Serializable from "./serializable";

// TODO: RETHINK THIS
/**
 * Base interface for every object, that can be rendered by the engine
 * 
 * Yes, it is an afterthought, what are you gonna do about it?
 * @interface
 */
export default interface Drawable extends Serializable{
    name: string;
    icon: string;
    topLeftCorner: Vec2;
    bottomRightCorner: Vec2;
    isSelected: boolean;
    setIsSelected: boolean;
    centerOfShape: Vec2;
    isInRectangle(rectPoint1: Vec2, rectPoint2: Vec2): boolean;
    translate(deltaDist: Vec2): void;
    rotate(angle: number, pos: Vec2): void;
    resize(sizeCoeff: Vec2, pos: Vec2): void;
    renderSelf(ctx: CanvasRenderingContext2D): void;
    renderNodes(ctx: CanvasRenderingContext2D): void;
}