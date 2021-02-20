import Shape           from "./shapes/shape";
import Node            from "./shapes/node";
import Line            from "./shapes/line";
import Vector2D        from "./utils/vector2d";
import MouseController from "./utils/mouseController";

enum Shapes {
    NONE,
    LINE,
    RECT,
    CIRCLE,
    BEZIER,
}

export default class Engine {
    canvas:        HTMLCanvasElement;
    ctx:           CanvasRenderingContext2D;
    mouse:         MouseController;
    shapes:        Array<Shape>;
    tempShape:     Shape | null = null;
    selectedNode:  Node | null  = null;
    curTypeToDraw: Shapes = Shapes.NONE;
    

    constructor(canvas: HTMLCanvasElement, width?: number, height?: number) {
        this.canvas        = canvas;
        this.ctx           = this.canvas.getContext("2d")!;
        this.shapes        = new Array<Shape>();
        this.mouse         = new MouseController(this.canvas);
        this.canvas.width  = 800;
        this.canvas.height = 500;
    }

    /**
     * Initialization method, sets up everything, including my well-beign, yea
     */
    init(): void {
        console.dir(this.shapes);
        
        this.canvas.addEventListener("mousedown", (e) => {
            if (e.button === 0) {
                this.tempShape = new Line();
                // to avoid fuckery with pointers we create a copy of the mouse position
                this.selectedNode = this.tempShape.getNextNode(Vector2D.copyFrom(this.mouse.getCurrentPosition()));
                // and then we just pass a pointer for a second node, because this one needs to move with the mouse
                this.selectedNode = this.tempShape.getNextNode(this.mouse.getCurrentPosition());
            }
            // temporary, I need internal state of the engine to determine what type of
            // action the user is currently performing
            if (e.button === 1) {
                // console.log("middle");
                this.selectedNode = null;
                for (let shape of this.shapes) {
                    this.selectedNode = shape.hitNode(this.mouse.getCurrentPosition());
                    if (this.selectedNode !== null) {
                        break;
                    }
                }

                if (this.selectedNode !== null) {
                    this.selectedNode.setPosition = this.mouse.getCurrentPosition();
                }
            }
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (e.button === 0) {
                if (this.tempShape !== null && this.selectedNode !== null) {
                    // This works, because JS is magic and passes instances of classes exclusively by a pointer.
                    // Because of that, I can take a reference (selectedNode), change its position, which will, in turn,
                    // change the position of node inside the shape (inside thempShape), which this (selectedNode) is a reference to, 
                    // and then overwrite the reference with new node.
                    // I have to do this to stop the node from moving with the mouse cursor
                    this.selectedNode.setPosition = Vector2D.copyFrom(this.mouse.getCurrentPosition());
                    // Now we try to create a new node, if it even exists
                    this.selectedNode = this.tempShape.getNextNode(Vector2D.copyFrom(this.mouse.getCurrentPosition()));
                    if (this.selectedNode == null) {
                        this.tempShape.color = "#fff";
                        this.shapes.push(Shape.clone<Line>(Line, this.tempShape));
                        this.tempShape = null;
                    }
                } else {
                    this.selectedNode = null;
                }
            }
            if (e.button === 1) {
                if (this.selectedNode !== null) {
                    this.selectedNode.setPosition = Vector2D.copyFrom(this.mouse.getCurrentPosition());
                    this.selectedNode = null;
                }
            }
        })
    }

    /**
     * Render method, renders the workspace and all the shapes on it
     */
    render(): void {
        this.ctx.fillStyle = "#191e38";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.shapes.forEach(shape => {
            shape.renderSelf(this.ctx);
            shape.renderNodes(this.ctx, "red");
        });

        if (this.tempShape !== null) {
            this.tempShape.renderSelf(this.ctx);
            this.tempShape.renderNodes(this.ctx, "yellow");
        }
        
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText(`x: ${this.mouse.getCurrentPosition().x}, y: ${this.mouse.getCurrentPosition().y}`, 
                                this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 10);
    }
}