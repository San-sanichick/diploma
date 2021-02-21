import Shape from "./shape";
import Vector2D from "../utils/vector2d";

export default class Line extends Shape {
    constructor() {
        super(2);
    }

    renderSelf(ctx: CanvasRenderingContext2D): void {
        // console.log(Shape.worldOffset);

        const sv: Vector2D = this.WorldToScreen(this.nodes[0].getPosition);
        const ev: Vector2D = this.WorldToScreen(this.nodes[1].getPosition);

        // console.log(sv);
        // console.log(this.color);
        ctx.fillStyle = "";
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(sv.x, sv.y);
        ctx.lineTo(ev.x, ev.y);
        ctx.stroke();
    }
}