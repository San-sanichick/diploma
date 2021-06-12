import Shape, { ShapeColor } from "./shape";
import Vec2 from "../utils/vector2d";
import DXFWriter from "@tarikjabiri/dxf";
import { ShapeIcons } from "@/utils/images";

export default class Arc extends Shape {
    constructor(name = "Arc") {
        super(name, 3, ShapeIcons.ArcIcon);
    }

    toDXF(drw: DXFWriter): void {
        // throw new Error("Method not implemented.");
        const sv = this.nodes[0].getPosition;

        const ev1 = this.nodes[1].getPosition;
        const ev2 = this.nodes[2].getPosition;

        const radius = ev1.subtract(sv).mag();

        const a = ev1.subtract(sv);
        const b = new Vec2(sv.x + 1, sv.y).subtract(sv);

        const angle1 = Math.atan2(a.y, a.x);
        const angle2 = Math.atan2(b.y, b.x);

        const angle = angle1 - angle2;

        const c = ev2.subtract(sv);
        const angle3 = Math.atan2(c.y, c.x);
        const _angle = angle1 - angle3;

        drw.addArc(sv.x, sv.y, radius, angle * (180/Math.PI), (angle - _angle) * (180/Math.PI));
    }

    renderSelf(ctx: CanvasRenderingContext2D, color?: string) {
        if (this.nodes.length <= 1) return;

        if (this.nodes.length === 2) {
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
        }

        if (this.nodes.length === 3) {
            const sv = this.WorldToScreen(this.nodes[0].getPosition);
            const ev1 = this.WorldToScreen(this.nodes[1].getPosition);
            const ev2 = this.WorldToScreen(this.nodes[2].getPosition);

            const radius = this.nodes[1].getPosition.subtract(this.nodes[0].getPosition).mag();

            const a = ev1.subtract(sv);
            const b = new Vec2(sv.x + 1, sv.y).subtract(sv);

            const angle1 = Math.atan2(a.y, a.x);
            const angle2 = Math.atan2(b.y, b.x);

            const angle = angle1 - angle2;

            const c = ev2.subtract(sv);
            const angle3 = Math.atan2(c.y, c.x);
            const _angle = angle1 - angle3;


            

            // ctx.save();
            //     ctx.setLineDash([5, 15]);
            //     ctx.beginPath();
            //     ctx.moveTo(sv.x, sv.y);
            //     ctx.lineTo(ev1.x, ev1.y);
            //     ctx.closePath();
            //     ctx.stroke();
            // ctx.restore();

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
                ctx.fillStyle = "";
                // ctx.beginPath();
                ctx.moveTo(ev1.x, ev1.y);
                ctx.arc(sv.x, sv.y, radius * Shape.worldScale * Shape.worldGrid, angle, angle - _angle, false);
                // ctx.closePath();
                ctx.stroke();
            ctx.restore();
        }
    }
}