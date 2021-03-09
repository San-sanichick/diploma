import Shape from "./shape";
import Vec2 from "../utils/vector2d";

export default class Rectangle extends Shape {
    constructor(name = "Rectangle") {
        super(name, 2);
    }

    renderSelf(ctx: CanvasRenderingContext2D) {
        if (this.nodes.length <= 1) return;

        const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
        const ev: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);

        // ctx.save();
        ctx.fillStyle = "";
        ctx.strokeStyle = this.isSelected ? "red" : this.color;

        /* calculate dx and dy of the rectange
           by subtracting its staring point from its ending point
        */
        const dimensions = ev.subtract(sv);

        ctx.moveTo(sv.x, sv.y)
        ctx.strokeRect(sv.x, sv.y, dimensions.x, dimensions.y);
        // ctx.restore();
    }
}