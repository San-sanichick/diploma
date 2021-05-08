import Shape from "./shape";
import Vec2 from "../utils/vector2d";

export default class Arc extends Shape {
    constructor(name = "Arc") {
        super(name, 3, "arc.svg");
    }

    renderSelf(ctx: CanvasRenderingContext2D, color?: string) {
        if (this.nodes.length <= 1) return;

        if (this.nodes.length < 3) {
            const radius = this.nodes[0].getPosition.subtract(this.nodes[1].getPosition).mag();

            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
            const mv: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);
            const ev: Vec2 = this.WorldToScreen(this.nodes[2].getPosition);

            ctx.strokeStyle = this.isSelected ? "red" : color ? color : this.color;

            ctx.save();
                ctx.setLineDash([5, 15]);
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                ctx.lineTo(ev.x, ev.y);
                ctx.closePath();
                ctx.stroke();
            ctx.restore();

            ctx.save();
                ctx.fillStyle = "";
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.arc(sv.x, sv.y, radius * Shape.worldScale * Shape.worldGrid, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.stroke();
            ctx.restore();
        }
    }
}