import Shape from "./shape";
import Vec2 from "../utils/vector2d";

export default class Ellipse extends Shape {
    constructor(name = "Ellipse") {
        super(name, 3);
    }

    renderSelf(ctx: CanvasRenderingContext2D) {
        if (this.nodes.length <= 1) return;

        if (this.nodes.length < 3) {
            const radius = this.nodes[0].getPosition.subtract(this.nodes[1].getPosition).mag();

            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
            const ev: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);

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
        } else if (this.nodes.length === 3) {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
            const mv: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);
            const ev: Vec2 = this.WorldToScreen(this.nodes[2].getPosition);

            const mvsv = new Vec2(1, this.nodes[0].getPosition.y).subtract(this.nodes[0].getPosition);
            const svev = this.nodes[2].getPosition.subtract(this.nodes[0].getPosition);

            const rad1 = this.nodes[1].getPosition.subtract(this.nodes[0].getPosition).mag();
            const rad2 = svev.mag();

            const angle = Math.acos(Vec2.dot(mvsv, svev) / (mvsv.mag() * rad2));

            ctx.strokeStyle = this.isSelected ? "red" : this.color;

            ctx.save();
                ctx.setLineDash([5, 15]);
                // ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                ctx.lineTo(mv.x, mv.y);
                ctx.closePath();
                ctx.stroke();
            ctx.restore();

            ctx.save();
                ctx.setLineDash([5, 15]);
                // ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                ctx.lineTo(ev.x, ev.y);
                ctx.closePath();
                ctx.stroke();
            ctx.restore();

            ctx.save();
                ctx.fillStyle = "";
                // ctx.strokeStyle = this.color;
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.ellipse(sv.x, sv.y, rad2 * Shape.worldScale * Shape.worldGrid, rad1 * Shape.worldScale * Shape.worldGrid, angle, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.stroke();
            ctx.restore();
        }
    }
}