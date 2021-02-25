import Shape from "./shape";
import Vector2D from "../utils/vector2d";

export default class Bezier extends Shape {
    constructor(name = "Bezier") {
        super(name, 4);
    }

    renderSelf(ctx: CanvasRenderingContext2D) {
        if (this.nodes.length <= 1) return;

        if (this.nodes.length < 3) {
            const sv: Vector2D = this.WorldToScreen(this.nodes[0].getPosition);
            const ev: Vector2D = this.WorldToScreen(this.nodes[1].getPosition);

            // console.log(sv);
            // console.log(this.color);
            ctx.save();
            ctx.setLineDash([5, 15]);
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(sv.x, sv.y);
            ctx.lineTo(ev.x, ev.y);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        } else if (this.nodes.length < 4) {
            const sv: Vector2D = this.WorldToScreen(this.nodes[0].getPosition);
            const mv: Vector2D = this.WorldToScreen(this.nodes[1].getPosition);
            const ev: Vector2D = this.WorldToScreen(this.nodes[2].getPosition);

            ctx.save();
                ctx.setLineDash([5, 15]);
                ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                ctx.lineTo(mv.x, mv.y);
                ctx.lineTo(ev.x, ev.y);
                ctx.closePath();
                ctx.stroke();
            ctx.restore();
        } else if (this.nodes.length === 4) {
            const sv: Vector2D  = this.WorldToScreen(this.nodes[0].getPosition);
            const mv: Vector2D  = this.WorldToScreen(this.nodes[1].getPosition);
            const mv2: Vector2D = this.WorldToScreen(this.nodes[2].getPosition);
            const ev: Vector2D  = this.WorldToScreen(this.nodes[3].getPosition);

            ctx.save();
                ctx.strokeStyle = this.color;
                ctx.moveTo(sv.x, sv.y);
                ctx.bezierCurveTo(mv.x, mv.y, mv2.x, mv2.y, ev.x, ev.y);
                ctx.stroke();
            ctx.restore();

            ctx.save();
                ctx.setLineDash([5, 15]);
                ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                ctx.lineTo(mv.x, mv.y);
                ctx.lineTo(mv2.x, mv2.y);
                ctx.lineTo(ev.x, ev.y);
                ctx.closePath();
                ctx.stroke();
            ctx.restore();

            
        }
    }
}