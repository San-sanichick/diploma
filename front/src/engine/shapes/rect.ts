import Shape from "./shape";
import Node from "./node";
import Vec2 from "../utils/vector2d";

export default class Rectangle extends Shape {
    constructor(name = "Rectangle") {
        super(name, 2, "rect.svg");
    }

    getNextNode(pos: Vec2): Node | null {
        if (this.nodes.length == this.maxNodeNumber) {
            // hacks, but it works, and works surprisingly well
            this.nodes.push(new Node(new Vec2(this.nodes[0].getPosition.x, this.nodes[1].getPosition.y), this));
            this.nodes.push(new Node(new Vec2(this.nodes[1].getPosition.x, this.nodes[0].getPosition.y), this));
            return null;
        }

        this.nodes.push(new Node(pos, this));
        return this.nodes[this.nodes.length - 1];
    }

    renderSelf(ctx: CanvasRenderingContext2D, color?: string) {
        if (this.nodes.length <= 1) return;

        ctx.fillStyle = "";
        ctx.strokeStyle = this.isSelected ? "red" : color ? color : this.color;

        if (this.nodes.length === 2) {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
            const ev: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);

            const dimensions = ev.subtract(sv);
            ctx.strokeRect(sv.x, sv.y, dimensions.x, dimensions.y);
        } else {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
            const m1v: Vec2 = this.WorldToScreen(this.nodes[2].getPosition);
            const m2v: Vec2 = this.WorldToScreen(this.nodes[3].getPosition);
            const ev: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);

            // ctx.save();
            

            /* calculate dx and dy of the rectange
            by subtracting its staring point from its ending point
            */
            // const dimensions = ev.subtract(sv);
            ctx.beginPath();
            ctx.moveTo(sv.x, sv.y);
            ctx.lineTo(m1v.x, m1v.y);
            ctx.lineTo(ev.x, ev.y);
            ctx.lineTo(m2v.x, m2v.y);
            ctx.closePath();
            ctx.stroke();
        }
        // ctx.strokeRect(sv.x, sv.y, dimensions.x, dimensions.y);
        // ctx.restore();
    }
}