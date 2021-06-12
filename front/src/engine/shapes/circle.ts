import Shape, { ShapeColor } from "./shape";
import Vec2 from "../utils/vector2d";
import DXFWriter from "@tarikjabiri/dxf";
import { ShapeIcons } from "@/utils/images";

export default class Circle extends Shape {
    constructor(name = "Circle") {
        super(name, 2, ShapeIcons.CircleIcon);
    }

    toDXF(drw: DXFWriter): void {
        const s = this.nodes[0].getPosition;
        const e = this.nodes[1].getPosition;
        const r = e.subtract(s).mag();

        drw.addCircle(s.x, s.y, r);
    }

    get centerOfShape(): Vec2 {
        return this.nodes[0].getPosition;
    }

    renderSelf(ctx: CanvasRenderingContext2D, color?: string) {
        if (this.nodes.length <= 1) return;

        // calculate the radius of the circle
        const radius = this.nodes[0].getPosition.subtract(this.nodes[1].getPosition).mag();

        const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
        const ev: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);
        
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
            ctx.setLineDash([5, 15]);
            ctx.beginPath();
            ctx.moveTo(sv.x, sv.y);
            ctx.lineTo(ev.x, ev.y);
            ctx.closePath();
            ctx.stroke();
            ctx.setLineDash([]);
        ctx.restore();

        ctx.save();
            ctx.fillStyle = "";
            ctx.beginPath();
            ctx.arc(sv.x, sv.y, radius * Shape.worldScale * Shape.worldGrid, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.stroke();
        ctx.restore();
    }
}