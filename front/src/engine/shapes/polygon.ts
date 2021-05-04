import Shape from "./shape";
import Vec2 from "../utils/vector2d";
import Node from "./node";

export default class Polygon extends Shape {
    private verticies: number;

    constructor(name = "Polygon", verticies: number) {
        super(name, 2, "polygon.svg");
        this.verticies = verticies;
    }

    getNextNode(pos: Vec2): Node | null {
        if (this.nodes.length == this.maxNodeNumber) {
            // again, this is silly, but it works
            const radius = this.nodes[1].getPosition.subtract(this.nodes[0].getPosition).mag();
            const x = this.nodes[0].getPosition.x;
            const y = this.nodes[0].getPosition.y;

            const a = this.nodes[1].getPosition.subtract(this.nodes[0].getPosition);
            const b = new Vec2(this.nodes[0].getPosition.x + 1, this.nodes[0].getPosition.y).subtract(this.nodes[0].getPosition);

            const angle1 = Math.atan2(a.y, a.x);
            const angle2 = Math.atan2(b.y, b.x);

            const angle = angle1 - angle2;
            
            for (let i = 1; i < this.verticies; i++) {
                this.nodes.push(new Node(new Vec2(
                    x + radius * Math.cos(angle + 2 * Math.PI * i / this.verticies), 
                    y + radius * Math.sin(angle + 2 * Math.PI * i / this.verticies)), 
                    this));
            }

            this.nodes.shift();

            return null;
        }

        this.nodes.push(new Node(pos, this));
        return this.nodes[this.nodes.length - 1];
    }

    renderSelf(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.isSelected ? "red" : this.color;

        if (this.nodes.length > 1 && this.nodes.length < 3) {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);
            const ev: Vec2 = this.WorldToScreen(this.nodes[1].getPosition);

            const a = sv.subtract(ev);
            const b = new Vec2(sv.x + 1, sv.y).subtract(sv);

            const angle1 = Math.atan2(a.y, a.x);
            const angle2 = Math.atan2(b.y, b.x);

            const angle = angle1 - angle2;

            const radius = ev.subtract(sv).mag();

            ctx.save();
                ctx.setLineDash([5, 15]);
                
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                ctx.lineTo(ev.x, ev.y);
                ctx.closePath();
                ctx.stroke();
            ctx.restore();

            ctx.save();
                ctx.fillStyle = "";
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(ev.x, ev.y);
                // fuck if I know why it has to be this way
                for (let i = 1; i < this.verticies; i++) {
                    ctx.lineTo(
                        sv.x - radius * Math.cos(angle + 2 * Math.PI * i / this.verticies), 
                        sv.y - radius * Math.sin(angle + 2 * Math.PI * i / this.verticies)
                    );
                }

                ctx.closePath();
                ctx.stroke();
            ctx.restore();
        } else if (this.nodes.length === this.verticies) {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);

            ctx.save();
                ctx.fillStyle = "";
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                for (let i = 1; i < this.nodes.length; i++) {
                    const pos = this.nodes[i].getPosition;
                    const coord: Vec2 = this.WorldToScreen(pos);
                    ctx.lineTo(coord.x, coord.y);
                }
                ctx.closePath();
                ctx.stroke();
            ctx.restore();
        }
    }
}