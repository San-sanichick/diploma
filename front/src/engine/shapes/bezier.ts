import Shape, { ShapeColor } from "./shape";
import Vec2 from "../utils/vector2d";
import DXFWriter from "@tarikjabiri/dxf";
import { ShapeIcons } from "@/utils/images";

export default class Bezier extends Shape {
    constructor(name = "Bezier") {
        super(name, 4, ShapeIcons.BezierIcon, "Bezier");
    }

    toDXF(drw: DXFWriter): void {
        const ctrlPoints = [];
        for (let i = 1; i < this.nodes.length - 1; i++) {
            ctrlPoints.push(
                [
                    this.nodes[i].getPosition.x,
                    this.nodes[i].getPosition.y
                ])
        }
        const fitPoints = [];

        fitPoints.push([
            this.nodes[0].getPosition.x,
            this.nodes[0].getPosition.y
        ]);
        fitPoints.push([
            this.nodes[this.nodes.length - 1].getPosition.x,
            this.nodes[this.nodes.length - 1].getPosition.y
        ])
        // document your bloody functions, i have no idea what any of these
        // parameters are for
        drw.addSpline(ctrlPoints, fitPoints, 3, 0, [1, 1, 1, 1], [2, 2]);
    }

    renderSelf(ctx: CanvasRenderingContext2D, color?: string) {
        if (this.nodes.length <= 1) return;

        if (this.nodes.length < 3) {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
            const ev: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);

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
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
            const mv: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);
            const ev: Vec2 = this.WorldToScreen(this.nodes[2].getPosition);

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
            const sv: Vec2  = this.WorldToScreen(this.nodes[0].getPosition);
            const mv: Vec2  = this.WorldToScreen(this.nodes[1].getPosition);
            const mv2: Vec2 = this.WorldToScreen(this.nodes[2].getPosition);
            const ev: Vec2  = this.WorldToScreen(this.nodes[3].getPosition);

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

            ctx.save();
                // ctx.strokeStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                ctx.bezierCurveTo(mv.x, mv.y, mv2.x, mv2.y, ev.x, ev.y);
                // ctx.closePath();
                ctx.stroke();
            ctx.restore();

            ctx.strokeStyle = this.color;

            ctx.save();
                ctx.setLineDash([5, 15]);
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