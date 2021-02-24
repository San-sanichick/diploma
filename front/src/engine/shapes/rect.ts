import Shape from "./shape";
import Vector2D from "../utils/vector2d";

export default class Rectangle extends Shape {
    constructor(name = "Rectangle") {
        super(name, 2);
    }

    renderSelf(ctx: CanvasRenderingContext2D) {
        if (this.nodes.length <= 1) return;

        const sv: Vector2D = this.WorldToScreen(this.nodes[0].getPosition);
        const ev: Vector2D = this.WorldToScreen(this.nodes[1].getPosition);

        // ctx.save();
        ctx.fillStyle = "";
        ctx.strokeStyle = this.color;

        /* calculate dx and dy of the rectange
           by subtracting its staring point from its ending point
        */
        const dimensions = ev.subtract(sv);

        ctx.moveTo(sv.x, sv.y)
        ctx.strokeRect(sv.x, sv.y, dimensions.x, dimensions.y);
        // ctx.restore();
    }
}