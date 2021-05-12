import Shape from "./shape";
import Vec2 from "../utils/vector2d";
// import Drawing, { Point2D } from "dxf-writer";
import DXFWriter from "@tarikjabiri/dxf";

export default class Polyline extends Shape {
    constructor(name = "Polyline") {
        // the polyline can have any number of nodes, and we can't define it,
        // we hhave to learn it at runtime
        super(name, Number.MAX_VALUE, "line.svg");
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

        if (this.nodes.length > 1) {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);

            ctx.save();
                ctx.fillStyle = "";
                ctx.strokeStyle = this.isSelected ? "red" : color ? color : this.color;
                // ctx.beginPath();
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
        }
    }
}