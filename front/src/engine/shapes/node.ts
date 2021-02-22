import Shape from "./shape";
import Vector2D from "../utils/vector2d";

/**
 * Node class, represents a node on the work field.
 * All shapes are created by nodes, done by nodes, undone by nodes.
 * Nodes are the epitome of existance
 */
export default class Node {
    private pos: Vector2D;
    private parent: Shape;
    public radius: number;
    public color = "red";

    constructor(pos: Vector2D, parent: Shape, radius = 4) {
        this.pos = pos;
        this.radius = radius;
        this.parent = parent;
    }

    set setPosition(newPos: Vector2D) {
        this.pos = newPos;
    }

    get getPosition() {
        return this.pos;
    }

    get getParent() {
        return this.parent;
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