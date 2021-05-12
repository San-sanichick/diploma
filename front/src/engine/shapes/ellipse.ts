import Shape from "./shape";
import Vec2 from "../utils/vector2d";
import Node from "./node";
import DXFWriter from "@tarikjabiri/dxf";

export default class Ellipse extends Shape {
    constructor(name = "Ellipse") {
        super(name, 3, "ellipse.svg");
    }

    // doesn't work right
    toDXF(drw: DXFWriter): void {
        // throw new Error("Method not implemented.");
        const s = this.nodes[0].getPosition;
        const ma = this.nodes[1].getPosition;
        const rmia = s.subtract(this.nodes[2].getPosition).mag();

        drw.addEllipse(s.x, s.y, ma.x, ma.y, rmia, 0, 2 * Math.PI);
    }

    renderSelf(ctx: CanvasRenderingContext2D, color?: string) {
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
            // const mv: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);
            // const ev: Vec2 = this.WorldToScreen(this.nodes[2].getPosition);

            // const mvsv = new Vec2(1, this.nodes[0].getPosition.y).subtract(this.nodes[0].getPosition);
            const svev = this.nodes[2].getPosition.subtract(this.nodes[0].getPosition);

            const rad1 = this.nodes[1].getPosition.subtract(this.nodes[0].getPosition).mag();
            const rad2 = svev.mag();

            ctx.strokeStyle = this.isSelected ? "red" : color ? color : this.color;

            ctx.save();
                ctx.fillStyle = "";
                // ctx.strokeStyle = this.color;
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.ellipse(sv.x, sv.y, rad2 * Shape.worldScale * Shape.worldGrid, rad1 * Shape.worldScale * Shape.worldGrid, 0, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.stroke();
            ctx.restore();
        }
    }
}