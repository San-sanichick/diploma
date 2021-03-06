import Shape, { ShapeColor } from "./shape";
import Vec2 from "../utils/vector2d";
// import Drawing, { Point2D } from "dxf-writer";
import DXFWriter from "@tarikjabiri/dxf";
import { ShapeIcons } from "@/utils/images";

export default class Polyline extends Shape {
    constructor(name = "Polyline") {
        // the polyline can have any number of nodes, and we can't define it,
        // we have to learn it at runtime
        super(name, Number.MAX_VALUE, ShapeIcons.PolylineIcon, "Polyline");
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