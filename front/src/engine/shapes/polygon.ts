import Shape, { ShapeColor } from "./shape";
import Vec2 from "../utils/vector2d";
import Node from "./node";
import DXFWriter from "@tarikjabiri/dxf";
import { ShapeIcons } from "@/utils/images";

export default class Polygon extends Shape {
    public vertices: number | undefined;

    constructor(name = "Polygon", verticies = 4) {
        super(name, 2, ShapeIcons.PolygonIcon, "Polygon");
        this.vertices = verticies;
    }

    toDXF(drw: DXFWriter): void {
        const points = [];
        for (const n of this.nodes) {
            points.push([n.getPosition.x, n.getPosition.y]);
        }


        //points.push(points[0]); You don't need to add the first point.

        // To create a polygon you need to pass the flag 1 to addPolyline() method.
        // A polygon is just a polyline but closed so passing the flag 1 tell to the lib to create a closed polyline.
        // 0 is the default value just create a polyline not closed
        // http://help.autodesk.com/view/OARX/2018/ENU/?guid=GUID-ABF6B778-BE20-4B49-9B58-A94E64CEFFF3
        // visit this url and see the Group code 70 (Polyline flag) in the specification.
        // And there is no Entity called Polygon in the specification.
        // if you noticed the addRectangle() implementation it just called the addPolyline with flag 1.
        drw.addPolyline(points, 1);
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