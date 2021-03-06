import Shape from "./shape";
import Vec2 from "../utils/vector2d";

export enum NodeColors {
    ACTIVE = "rgba(200, 200, 100, 1)",
    INACTIVE = "#888"
}

/**
 * Node class, represents a node on the work field.
 * All shapes are created by nodes, done by nodes, undone by nodes.
 * Nodes are the epitome of existance
 */
export default class Node {
    private pos: Vec2;
    // private parent: Shape;
    public radius: number;
    public color = NodeColors.INACTIVE;

    constructor(pos: Vec2, parent: Shape, radius = 4) {
        this.pos = pos;
        this.radius = radius;
        // this.parent = parent;
    }

    set setPosition(newPos: Vec2) {
        this.pos = newPos;
    }

    get getPosition() {
        return this.pos;
    }

    // get getParent() {
    //     return this.parent;
    // }

    toString() {
        return this.pos.toString();
    }

    // /**
    //  * Renders a node with a given color on a given context
    //  * @param ctx 2D canvas context
    //  * @param color color
    //  */
    // render(ctx: CanvasRenderingContext2D, color: string): void {
    //     ctx.fillStyle = color;
    //     ctx.moveTo(this.pos.x, this.pos.y)
    //     ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    //     ctx.fill();
    // }
}