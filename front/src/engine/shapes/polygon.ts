import Shape, { ShapeColor } from "./shape";
import Vec2 from "../utils/vector2d";
import Node from "./node";
import DXFWriter from "@tarikjabiri/dxf";
import { invertHex } from "../utils/util";

export default class Polygon extends Shape {
    public vertices: number | undefined;

    constructor(name = "Polygon", verticies: number) {
        super(name, 2, "polygon.svg");
        this.vertices = verticies;
    }

    toDXF(drw: DXFWriter): void {
        const points = [];
        for (const n of this.nodes) {
            points.push([n.getPosition.x, n.getPosition.y]);
        }

        points.push(points[0]);

        drw.addPolyline(points, 0);
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
            
            if (this.vertices) {
                for (let i = 1; i < this.vertices; i++) {
                    this.nodes.push(new Node(new Vec2(
                        x + radius * Math.cos(angle + 2 * Math.PI * i / this.vertices), 
                        y + radius * Math.sin(angle + 2 * Math.PI * i / this.vertices)), 
                        this));
                }
            }

            this.nodes.shift();

            return null;
        }

        this.nodes.push(new Node(pos, this));
        return this.nodes[this.nodes.length - 1];
    }

    renderSelf(ctx: CanvasRenderingContext2D, color?: string): void {
        ctx.strokeStyle = color ? color : this.color;

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
                if (this.vertices) {
                    for (let i = 1; i < this.vertices; i++) {
                        ctx.lineTo(
                            sv.x - radius * Math.cos(angle + 2 * Math.PI * i / this.vertices), 
                            sv.y - radius * Math.sin(angle + 2 * Math.PI * i / this.vertices)
                        );
                    }
                }

                ctx.closePath();
                ctx.stroke();
            ctx.restore();
        } else if (this.nodes.length === this.vertices) {
            const sv: Vec2 = this.WorldToScreen(this.nodes[0].getPosition);

            ctx.setLineDash([]);
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