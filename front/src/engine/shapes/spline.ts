import Shape, { ShapeColor } from "./shape";
import Vec2 from "../utils/vector2d";
// import Drawing, { Point2D } from "dxf-writer";
import DXFWriter from "@tarikjabiri/dxf";
import { invertHex } from "../utils/util";

export default class Spline extends Shape {
    constructor(name = "Spline") {
        // the polyline can have any number of nodes, and we can't define it,
        // we have to learn it at runtime
        super(name, Number.MAX_VALUE, "polyline.svg");
    }

    toDXF(drw: DXFWriter): void {
        const points = [];
        for (const n of this.nodes) {
            points.push([n.getPosition.x, n.getPosition.y]);
        }

        drw.addPolyline(points, 0);
    }

    renderSelf(ctx: CanvasRenderingContext2D, color?: string): void {
        // console.log(Shape.worldOffset);

        if (this.nodes.length < 3) {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);

            ctx.save();
                ctx.fillStyle = "";
                ctx.strokeStyle = color ? color : this.color;
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                // ctx.lineTo(ev.x, ev.y);
                for (const node of this.nodes) {
                    const v: Vec2 = this.WorldToScreen(node.getPosition);
                    ctx.lineTo(v.x, v.y);
                }
                // ctx.closePath();
                ctx.stroke();
                ctx.strokeStyle = "";
            ctx.restore();
        } else {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);

            ctx.save();
                ctx.fillStyle = "";
                ctx.strokeStyle = color ? color : this.color;
                if (this.isSelected) {
                    ctx.setLineDash([5, 5]);
                    ctx.strokeStyle = ShapeColor.ACTIVE;
                    ctx.lineWidth = 3;
                    // ctx.strokeStyle = invertHex(this.color);
                    // if (color) {
                    //     ctx.strokeStyle = invertHex(color);
                    // }
                }
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                // ctx.lineTo(ev.x, ev.y);
                for (let i = 0; i < this.nodes.length - 1; i++) {
                    const node = this.nodes[i];
                    const nodeNext = this.nodes[i + 1];
                    const v1: Vec2 = this.WorldToScreen(node.getPosition);
                    const v2: Vec2 = this.WorldToScreen(nodeNext.getPosition);
                    const mid = new Vec2((v1.x + v2.x) / 2, (v1.y + v2.y) / 2);
                    const cpx1 = (mid.x + v1.x) / 2;
                    const cpx2 = (mid.x + v2.x) / 2;
                    
                    ctx.quadraticCurveTo(cpx1, v1.y, mid.x, mid.y);
                    ctx.quadraticCurveTo(cpx2, v2.y, v2.x, v2.y)
                }
                // ctx.closePath();
                ctx.stroke();
                ctx.strokeStyle = "";
            ctx.restore();
        }
    }
}