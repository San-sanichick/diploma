import Node, { NodeColors } from "./node";
import Vec2 from "../utils/vector2d";
import Matrix from "../utils/matrix";
// import Serializable from "./serializable"
import Drawable from "./drawable";
import { clamp, fastRounding, mapRange } from "../utils/math";
import DXFWriter from "@tarikjabiri/dxf";

export interface ShapeObject {
    type: string;
    maxNodes: number;
    color: string;
    name: string;
    isSelected: boolean;
    vertices?: number;
    // eslint-disable-next-line
    nodes: Array<any>;
}

export enum ShapeColor {
    ACTIVE = "#9000ff",

}

/**
 * Abstract shape class, use as basis for every other shape
 */
export default abstract class Shape implements Drawable {
    public    type: string | undefined;
    /**
     * Max nodes specifies how many nodes does the user have to place to draw the shape,
     * but not the overall maximum of nodes the shape can have. Very confusing, I know,
     * guess what, its an afterthought, once again.
     * 
     * For example, a Rectangle has 4 nodes. And a Polygon can have any number of nodes
     * 
     * Another fun example is Polyline, its value of maxNodes is Number.MAX_VALUE. This value gets
     * updated at runtime, when the user ends drawing the Polylne. 
     * @private
     */
    private   maxNodes: number;
    public    color: string;
    public    name: string;
    public    icon: string;
    public    isSelected: boolean;
    public    topLeftCorner: Vec2;
    public    bottomRightCorner: Vec2;
    /**
     * An array of nodes in a shape. The number of nodes is dictated by maxNodes
     * @protected
     */
    protected nodes: Array<Node>;
    public static worldScale: number;
    public static worldOffset: Vec2;
    public static worldGrid: number;
    public static magnitude = 0.5;
    // hacks
    public vertices?: number;

    constructor(name = "shape", maxNodes: number, icon: string) {
        this.maxNodes = maxNodes;
        this.name = name;
        this.nodes = new Array<Node>();
        this.color = "#888";
        this.icon = icon;
        this.isSelected = false;
        this.type = this.constructor.name;
        this.topLeftCorner = new Vec2(0, 0);
        this.bottomRightCorner = new Vec2(20, 20);
    }

    protected WorldToScreen(v: Vec2): Vec2 {
        return v.subtract(Shape.worldOffset).multiply(Shape.worldScale * Shape.worldGrid);
    }

    /**
     * Creates a copy of a given shape with a given type.
     * This is necessary, because the creators of JS hate us,
     * and did not implement the ability to overload constructors,
     * or anything for that matter.
     * 
     * In theory, we could use Object.assign, but that is a terrible idea
     * for classes, because it makes a shallow copy, and not a deep copy.
     * 
     * Usage example:
     * let newShape = Shape.clone<SomeShapeType>(SomeShapeType, otherShape);
     * 
     * @static
     * @param {T} type Shape type
     * @param {T} shape The shape to clone from
     */
    public static clone<T extends Shape>(type: { new(name: string, maxNodes: number): T}, shape: T): T {
        const temp = new type(shape.name, shape.maxNodes);
        temp.type = shape.type;
        temp.nodes = [...shape.nodes];
        temp.color = shape.color;
        return temp;
    }

    public static cloneFromObject<T extends Shape>(type: { new(name: string, maxNodes: number): T}, obj: ShapeObject): T {
        const temp = new type(obj.name, obj.maxNodes);
        temp.type = obj.type;
        temp.vertices = obj.vertices;
        // temp.nodes = [...obj.nodes];

        obj.nodes.forEach(node => {
            temp.nodes.push(new Node(new Vec2(node.pos.x, node.pos.y), temp, node.radius));
        })

        temp.color = obj.color;
        return temp;
    }

    /**
     * Creates a new node if it possible and returns it
     * @param {Vec2} pos position of a new node
     * @returns {Node | null} Node if successful, null otherwise
     */
    getNextNode(pos: Vec2): Node | null {
        if (this.nodes.length == this.maxNodes) {
            return null;
        }

        this.nodes.push(new Node(pos, this));
        return this.nodes[this.nodes.length - 1];
    }

    /**
     * Finds a node in the close proximity to the given coordinates
     * @param {Vec2} curPos Current position of the mouse cursor
     * @returns {Node | null} Node, if found, null otherwise
     */
    hitNode(curPos: Vec2): Node | null {
        for (const node of this.nodes) {
            if (Math.abs(curPos.subtract(node.getPosition).mag()) <= Shape.magnitude) {
                return node;
            }
        }

        return null;
    }

    isInRectangle(rectPoint1: Vec2, rectPoint2: Vec2): boolean {
        let
            rectSX = rectPoint1.x,
            rectSY = rectPoint1.y, 
            rectEX = rectPoint2.x, 
            rectEY = rectPoint2.y;
        
        // not so clever hacks, but it works
        if (rectPoint1.x > rectPoint2.x) {
            rectSX = rectPoint2.x;
            rectEX = rectPoint1.x;
        }
        if (rectPoint1.y > rectPoint2.y) {
            rectSY = rectPoint2.y;
            rectEY = rectPoint1.y;
        }

        for (const node of this.nodes) {
            const 
                x = node.getPosition.x,
                y = node.getPosition.y;

            if (x <= rectSX || y <= rectSY || x >= rectEX || y >= rectEY) {
                return false;
            }
        }
        return true;
    }

    set setIsSelected(val: boolean) {
        this.isSelected = val;
        if (this.isSelected) {
            this.nodes.forEach(node => {
                node.color = NodeColors.ACTIVE;
            });
        } else {
            this.nodes.forEach(node => {
                node.color = NodeColors.INACTIVE;
            });
        }
    }

    get centerOfShape(): Vec2 {
        let sumX = 0,
            sumY = 0;
        for (const node of this.nodes) {
            sumX += node.getPosition.x;
            sumY += node.getPosition.y;
        }

        sumX /= this.nodes.length;
        sumY /= this.nodes.length;
        return new Vec2(fastRounding(sumX), fastRounding(sumY));
    }

    get maxNodeNumber() {
        return this.maxNodes;
    }

    set setMaxNodeNumber(newMaxNodes: number) {
        this.maxNodes = newMaxNodes;
    }

    get getNodes(): Node[] {
        return this.nodes;
    }

    /**
     * Translates the shape in space by a given distance
     * @param deltaDist distance
     */
    translate(deltaDist: Vec2): void {
        // Translation matrix
        const trMatrix = new Matrix([
            [1          , 0          , 0],
            [0          , 1          , 0],
            [deltaDist.x, deltaDist.y, 1]
        ]);

        const coords = [];
        for (const node of this.nodes) {
            coords.push([node.getPosition.x, node.getPosition.y, 1]);
        }

        const coordMatrix = new Matrix(coords);

        const newCoord = Matrix.multMatrixByMatrix(coordMatrix, trMatrix);
        
        for (let i = 0; i < this.nodes.length; i++) {
            const temp = new Vec2(newCoord.value[i][0], newCoord.value[i][1]);
            this.nodes[i].setPosition = temp;
        }
    }

    /**
     * Rotates the shape relative to given pivot point
     * @param angle Angle to rotate by
     * @param pos pivot point
     */
    rotate(angle: number, pos: Vec2): void {
        // translate to origin
        // angle = angle * (Math.PI / 180);

        const trMatrix = new Matrix([
            [1, 0, 0],
            [0, 1, 0],
            [-pos.x, -pos.y, 1]
        ]);
        
        const rtMatrix = new Matrix([
            [ Math.cos(angle), Math.sin(angle), 0],
            [-Math.sin(angle), Math.cos(angle), 0],
            [0               , 0              , 1]
        ]);

        // move it back to initial position
        const reTrMatrix = new Matrix([
            [1, 0, 0],
            [0, 1, 0],
            [pos.x, pos.y, 1]
        ]);

        // multiply all that stuff
        const m = Matrix.multMatrixByMatrix(Matrix.multMatrixByMatrix(trMatrix, rtMatrix), reTrMatrix);

        const coords = [];
        for (const node of this.nodes) {
            coords.push([node.getPosition.x, node.getPosition.y, 1]);
        }

        const coordMatrix = new Matrix(coords);

        const newCoord = Matrix.multMatrixByMatrix(coordMatrix, m);
    

        for (let i = 0; i < this.nodes.length; i++) {
            const temp = new Vec2(newCoord.value[i][0], newCoord.value[i][1]);
            this.nodes[i].setPosition = temp;
        }
    }

    /**
     * Resizes the shape relative to pivot point
     * 
     * Also it doesn't bloody work
     * @param sizeCoeff resize coefficient
     * @param pos pivot point
     */
    resize(sizeCoeff: Vec2, pos: Vec2): void {
        let c = 0;
        if (sizeCoeff.x < 0) {
            c = 0.97;
        } else {
            c = 1.03;
        }

        // translate to origin
        const trMatrix = new Matrix([
            [1, 0, 0],
            [0, 1, 0],
            [-pos.x, -pos.y, 1]
        ]);

        // scale matrix
        const scMatrix = new Matrix([
            [c, 0, 0],
            [0, c, 0],
            [0, 0, 1]
        ]);

        // move it back to initial position
        const reTrMatrix = new Matrix([
            [1, 0, 0],
            [0, 1, 0],
            [pos.x, pos.y, 1]
        ]);

        // multiply all that stuff
        const m = Matrix.multMatrixByMatrix(Matrix.multMatrixByMatrix(trMatrix, scMatrix), reTrMatrix);

        const coords = [];
        for (const node of this.nodes) {
            coords.push([node.getPosition.x, node.getPosition.y, 1]);
        }

        const coordMatrix = new Matrix(coords);

        const newCoord = Matrix.multMatrixByMatrix(coordMatrix, m);
        
        // console.log(newCoord.value);
        // get some bullshit result
        for (let i = 0; i < this.nodes.length; i++) {
            for (let i = 0; i < this.nodes.length; i++) {
                const temp = new Vec2(newCoord.value[i][0], newCoord.value[i][1]);
                // temp.round();
                this.nodes[i].setPosition = temp;
            }
        }
    }

    setNodeColor(color: NodeColors) {
        this.nodes.forEach(node => node.color = color);
    }

    get numberOfNodes() {
        return this.nodes.length;
    }

    /**
     * Renders shape with a set color on a given context
     * @param ctx 2D canvas context
     */
    abstract renderSelf(ctx: CanvasRenderingContext2D, color?: string): void

    abstract toDXF(drw: DXFWriter): void;

    /**
     * Renders nodes with a given color on given context
     * @param ctx 2D canvas context
     * @param color color of the nodes
     */
    renderNodes(ctx: CanvasRenderingContext2D) {
        this.nodes.forEach(node => {
            const sv = this.WorldToScreen(node.getPosition);
            ctx.save();
                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.moveTo(sv.x, sv.y);
                ctx.fillRect(sv.x - node.radius, sv.y - node.radius, 2 * node.radius, 2 * node.radius);
                ctx.fillStyle = "";
            // 
            // ctx.beginPath();
            // ctx.arc(sv.x, sv.y, node.radius, 0, Math.PI * 2);
                ctx.closePath();
            // ctx.fill();
            ctx.restore();
        })
    }

    public toString(): string {
        return `Name: ${this.name}, nodes: ${this.nodes.length}`
    }
}