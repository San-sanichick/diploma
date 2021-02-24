import Shape from "./shape";
import Vector2D from "../utils/vector2d";

export default class Circle extends Shape {
    constructor(name = "Circle") {
        super(name, 2);
    }

    renderSelf(ctx: CanvasRenderingContext2D) {
        // calculate the radius of the circle
        const radius = this.nodes[0].getPosition.subtract(this.nodes[1].getPosition).mag();

        const sv: Vector2D = this.WorldToScreen(this.nodes[0].getPosition);
        const ev: Vector2D = this.WorldToScreen(this.nodes[1].getPosition);
        
        ctx.save();
            ctx.setLineDash([5, 15]);
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(sv.x, sv.y);
            ctx.lineTo(ev.x, ev.y);
            ctx.closePath();
            ctx.stroke();
        ctx.restore();

        ctx.save();
            ctx.fillStyle = "";
            ctx.strokeStyle = this.color;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(sv.x, sv.y, radius * Shape.worldScale * Shape.worldGrid, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.stroke();
        ctx.restore();
    }
}