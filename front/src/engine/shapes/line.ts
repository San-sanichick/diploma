import Shape from "./shape";
import Vec2 from "../utils/vector2d";

export default class Line extends Shape {
    constructor(name = "Line") {
        super(name, 2);
    }

    renderSelf(ctx: CanvasRenderingContext2D): void {
        // console.log(Shape.worldOffset);

        if (this.nodes.length > 1) {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
            const ev: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);

            // Contrary to my assumption, checking if shape is off screen slows everything
            // significantly down, so don't do it
            // if ((sv.x < 0 || sv.y < 0) && (ev.x < 0 || ev.y < 0)) {
            //     console.log("NOT DRAWN");
            //     return;
            // }
            // console.log(sv);
            // console.log(this.color);
            // ctx.save();
            ctx.fillStyle = "";
            ctx.strokeStyle = this.isSelected ? "red" : this.color;
            ctx.beginPath();
            ctx.moveTo(sv.x, sv.y);
            ctx.lineTo(ev.x, ev.y);
            ctx.stroke();
        }
        // ctx.restore();
    }
}