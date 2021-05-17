import Shape, { ShapeColor } from "./shape";
import Vec2 from "../utils/vector2d";
import Node from "./node";
import DXFWriter from "@tarikjabiri/dxf";
import { invertHex } from "../utils/util";

export default class Ellipse extends Shape {
    constructor(name = "Ellipse") {
        super(name, 3, "ellipse.svg");
    }

    // doesn't work right
    toDXF(drw: DXFWriter): void {
        // throw new Error("Method not implemented.");
        const s = this.nodes[0].getPosition;
        const majAxis = this.nodes[1].getPosition;
        const minAxis = this.nodes[2].getPosition;
        const rmia = minAxis.subtract(s).mag() / majAxis.subtract(s).mag();

        drw.addEllipse(s.x, s.y, majAxis.x, majAxis.y, rmia, 0, 2 * Math.PI);
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
            const ev: Vec2 = this.WorldToScreen(this.nodes[2].getPosition);

            // const mvsv = new Vec2(1, this.nodes[0].getPosition.y).subtract(this.nodes[0].getPosition);
            const svev = this.nodes[2].getPosition.subtract(this.nodes[0].getPosition);

            const rad1 = this.nodes[1].getPosition.subtract(this.nodes[0].getPosition).mag();
            const rad2 = svev.mag();


            const a = sv.subtract(ev);
            const b = new Vec2(sv.x + 1, sv.y).subtract(sv);

            const angle1 = Math.atan2(a.y, a.x);
            const angle2 = Math.atan2(b.y, b.x);

            const angle = angle1 - angle2;

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
                ctx.ellipse(
                        sv.x, 
                        sv.y, 
                        rad2 * Shape.worldScale * Shape.worldGrid, 
                        rad1 * Shape.worldScale * Shape.worldGrid, 
                        angle, 
                        0, 
                        2 * Math.PI, 
                        false);
                ctx.closePath();
                ctx.stroke();
            ctx.restore();
        }
    }
}