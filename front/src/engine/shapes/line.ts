import Shape, { ShapeColor } from "./shape";
import Vec2 from "../utils/vector2d";
import DXFWriter from "@tarikjabiri/dxf";
import { invertHex } from "../utils/util";

export default class Line extends Shape {
    constructor(name = "Line") {
        super(name, 2, "line.svg");
    }

    toDXF(drw: DXFWriter) {
        const s = this.nodes[0].getPosition;
        const e = this.nodes[1].getPosition;
        drw.addLine(s.x, s.y, e.x, e.y);
    }

    renderSelf(ctx: CanvasRenderingContext2D, color?: string): void {
        // console.log(Shape.worldOffset);

        if (this.nodes.length > 1) {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
            const ev: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);

            // Contrary to my assumption, checking if shape is off screen slows everything
            // significantly down, so don't do it
            ctx.save();
                ctx.fillStyle = "";
                ctx.strokeStyle = color ? color : this.color;
                if (this.isSelected) {
                    ctx.setLineDash([5, 5]);
                    ctx.strokeStyle = ShapeColor.ACTIVE;
                    ctx.lineWidth = 3;
                }
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                ctx.lineTo(ev.x, ev.y);
                ctx.closePath();
                ctx.stroke();
                ctx.strokeStyle = "";
            ctx.restore();
        }
    }
}