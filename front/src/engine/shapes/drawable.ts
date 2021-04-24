import Vec2 from "../utils/vector2d";
import Serializable from "./serializable";

// TODO: RETHINK THIS
export default interface Drawable extends Serializable{
    name: string;
    topLeftCorner: Vec2;
    bottomRightCorner: Vec2;
    isSelected: boolean;
    setIsSelected: boolean;
    isInRectangle(rectPoint1: Vec2, rectPoint2: Vec2): boolean;
    translate(deltaDist: Vec2): void;
    rotate(angle: number): void;
    resize(sizeCoeff: number, pos: Vec2): void;
    renderSelf(ctx: CanvasRenderingContext2D): void;
    renderNodes(ctx: CanvasRenderingContext2D): void;
}