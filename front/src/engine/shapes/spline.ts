import Shape, { ShapeColor } from "./shape";
import Vec2 from "../utils/vector2d";
// import Drawing, { Point2D } from "dxf-writer";
import DXFWriter from "@tarikjabiri/dxf";
import Node from "./node";
import { CurveInterpolator } from "curve-interpolator";
import { invertHex } from "../utils/util";

export default class Spline extends Shape {
    private interpVertecies: Array<Array<number>>;

    constructor(name = "Spline") {
        // the polyline can have any number of nodes, and we can't define it,
        // we have to learn it at runtime
        super(name, Number.MAX_VALUE, "polyline.svg");
        this.interpVertecies = [];
    }

    private interpolate() {
        const points = [];
        for (const node of this.nodes) {
            points.push(node.getPosition.arrCoords);
        }

        const interp = new CurveInterpolator(points, { tension: 0.1 });
        this.interpVertecies = interp.getPoints(100);
        // console.log(this.interpVertecies.length);
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
            this.interpolate();

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
                for (let i = 1; i < this.interpVertecies.length; i++) {
                    const vert = this.interpVertecies[i];
                    const mult = Shape.worldScale * Shape.worldGrid;
                    const x = (vert[0] - Shape.worldOffset.x) * mult;
                    const y = (vert[1] - Shape.worldOffset.y) * mult;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.strokeStyle = "";
            ctx.restore();
        }
    }
}