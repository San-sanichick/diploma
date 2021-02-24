import Node from "./node";
import Vector2D from "../utils/vector2d";

/**
 * Abstract shape class, use as basis for every other shape
 */
export default abstract class Shape {
    /**
     * For the sake of my sanity, shapes are not going to have > 3 nodes
     * @private
     */
    private   maxNodes: number;
    public    color: string;
    public    name: string;
    /**
     * An array of nodes in a shape. The number of nodes is dictated by maxNodes
     * @protected
     */
    protected nodes: Array<Node>;
    public static worldScale: number;
    public static worldOffset: Vector2D;
    public static worldGrid: number;
    public static magnitude = 0.5;

    constructor(name = "shape", maxNodes: number) {
        this.maxNodes = maxNodes;
        this.name = name;
        this.nodes = new Array<Node>();
        this.color = "#888";
    }

    protected WorldToScreen(v: Vector2D): Vector2D {
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
        temp.nodes = [...shape.nodes];
        temp.color = shape.color;
        return temp;
    }

    /**
     * Creates a new node if it possible and returns it
     * @param {Vector2D} pos position of a new node
     * @returns {Node | null} Node if successful, null otherwise
     */
    getNextNode(pos: Vector2D): Node | null {
        if (this.nodes.length == this.maxNodes) {
            return null;
        }

        this.nodes.push(new Node(pos, this));
        return this.nodes[this.nodes.length - 1];
    }

    /**
     * Finds a node in the close proximity to the given coordinates
     * @param {Vector2D} curPos Current position of the mouse cursor
     * @returns {Node | null} Node, if found, null otherwise
     */
    hitNode(curPos: Vector2D): Node | null {
        for (const node of this.nodes) {
            if (Math.abs(curPos.subtract(node.getPosition).mag()) <= Shape.magnitude) {
                return node;
            }
        }

        return null;
    }

    translate(deltaDist: Vector2D): void {
        // later
    }
    rotate(angle: number): void {
        // later
    }
    resize(sizeCoeff: number): void {
        // later
    }

    setNodeColor(color: string) {
        this.nodes.forEach(node => node.color = color);
    }

    /**
     * Renders shape with a set color on a given context
     * @param ctx 2D canvas context
     */
    abstract renderSelf(ctx: CanvasRenderingContext2D): void

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
            ctx.strokeStyle = "";
            // ctx.moveTo(sv.x, sv.y);
            ctx.beginPath();
            ctx.arc(sv.x, sv.y, node.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        })
    }
}