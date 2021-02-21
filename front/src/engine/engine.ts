import Shape           from "./shapes/shape";
import Node            from "./shapes/node";
import Line            from "./shapes/line";
import Vector2D        from "./utils/vector2d";
import MouseController from "./utils/mouseController";
import { clamp }       from "./utils/math";

enum Shapes {
    NONE,
    LINE,
    RECT,
    CIRCLE,
    BEZIER,
    ARC
}

export default class Engine {
    canvas:        HTMLCanvasElement;
    ctx:           CanvasRenderingContext2D | null;
    mouse:         MouseController;
    shapes:        Array<Shape>;
    tempShape:     Shape | null = null;
    selectedNode:  Node | null  = null;
    curTypeToDraw: Shapes = Shapes.NONE;
    private scale = 10.0;
    private grid = 2.0;
    private offset: Vector2D = new Vector2D(0.0, 0.0);
    private startPan: Vector2D = new Vector2D(0.0, 0.0);
    private cursor = new Vector2D(0.0, 0.0);
    // private mouseBeforeZoom: Vector2D = new Vector2D(0.0, 0.0);
    // private mouseAfterZoom: Vector2D = new Vector2D(0.0, 0.0);

    constructor(canvas: HTMLCanvasElement, width?: number, height?: number) {
        this.canvas        = canvas;
        this.ctx           = this.canvas.getContext("2d");
        if (this.ctx === null) throw new Error("error when getting 2d context");
        this.shapes        = new Array<Shape>();
        this.mouse         = new MouseController(this.canvas);
        this.canvas.width  = width ?? 500;
        this.canvas.height = height ?? 500;
    }

    private WorldToScreen(v: Vector2D): Vector2D {
        return v.subtract(this.offset).multiply(this.scale);
    }

    private ScreenToWorld(screenCoord: Vector2D): Vector2D {
        return screenCoord.divide(this.scale).add(this.offset);
    }

    /**
     * Initialization method, sets up everything, including my well-beign, yea
     */
    init(): void {
        console.dir(this.shapes);
        
        // this.canvas.addEventListener("mousedown", (e) => {
        //     if (e.button === 0) {
        //         this.tempShape = new Line();
        //         // to avoid fuckery with pointers we create a copy of the mouse position
        //         this.selectedNode = this.tempShape.getNextNode(Vector2D.copyFrom(this.cursor));
        //         // and then we just pass a pointer for a second node, because this one needs to move with the mouse
        //         this.selectedNode = this.tempShape.getNextNode(this.cursor);
        //     }
        //     // temporary, I need internal state of the engine to determine what type of
        //     // action the user is currently performing
        //     if (e.button === 1) {
        //         // console.log("middle");
        //         this.selectedNode = null;
        //         for (const shape of this.shapes) {
        //             this.selectedNode = shape.hitNode(this.cursor);
        //             if (this.selectedNode !== null) {
        //                 break;
        //             }
        //         }

        //         if (this.selectedNode !== null) {
        //             this.selectedNode.setPosition = this.cursor;
        //         }
        //     }
        // });

        // this.canvas.addEventListener("mouseup", (e) => {
        //     if (e.button === 0) {
        //         if (this.tempShape !== null && this.selectedNode !== null) {
        //             // This works, because JS is magic and passes instances of classes exclusively by a pointer.
        //             // Because of that, I can take a reference (selectedNode), change its position, which will, in turn,
        //             // change the position of node inside the shape (inside thempShape), which this (selectedNode) is a reference to, 
        //             // and then overwrite the reference with new node.
        //             // I have to do this to stop the node from moving with the mouse cursor
        //             this.selectedNode.setPosition = Vector2D.copyFrom(this.cursor);
        //             // Now we try to create a new node, if it even exists
        //             this.selectedNode = this.tempShape.getNextNode(Vector2D.copyFrom(this.cursor));
        //             if (this.selectedNode == null) {
        //                 this.tempShape.color = "#fff";
        //                 this.shapes.push(Shape.clone<Line>(Line, this.tempShape));
        //                 this.tempShape = null;
        //             }
        //         } else {
        //             this.selectedNode = null;
        //         }
        //     }
        //     if (e.button === 1) {
        //         if (this.selectedNode !== null) {
        //             this.selectedNode.setPosition = Vector2D.copyFrom(this.cursor);
        //             this.selectedNode = null;
        //         }
        //     }
        // });

        // this.canvas.addEventListener("wheel", (e) => {
        //     // this.mouseBeforeZoom = this.ScreenToWorld(Vector2D.copyFrom(this.mouse.getCurrentPosition()));
        //     this.scale += e.deltaY * -0.1;
        //     // this.mouseAfterZoom = this.ScreenToWorld(Vector2D.copyFrom(this.mouse.getCurrentPosition()));
        //     // this.offset.add(this.mouseBeforeZoom.subtract(this.mouseAfterZoom)); 
        // });
    }

    

    /**
     * Update method, has to be run through requestAnimationFrame
     * or, theoretically, called manually each time we want to update something,
     * which could potentially save up resources
     */
    update(): void {
        if (this.ctx === null) return;
        // const mouseCurPos = this.mouse.getCurrentPosition();

        const mouseBeforeZoom = this.ScreenToWorld(Vector2D.copyFrom(this.mouse.getCurrentPosition()));
        
        if(this.mouse.mouseScrolled) {
            this.scale += this.mouse.getDelta * -0.11;
            this.scale = clamp(this.scale, 5, 50);
        }
        
        const mouseAfterZoom = this.ScreenToWorld(Vector2D.copyFrom(this.mouse.getCurrentPosition()));
        this.offset.add(mouseBeforeZoom.subtract(mouseAfterZoom));
        
        this.cursor = mouseAfterZoom.add(new Vector2D(0.5, 0.5).multiply(this.grid));
        this.cursor.floor();

        // rendering
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#191e38";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let sv: Vector2D,
            ev: Vector2D;

        const worldTopLeft: Vector2D = this.ScreenToWorld(new Vector2D(0, 0));
        const worldBottomRight: Vector2D  = this.ScreenToWorld(new Vector2D(this.canvas.width, this.canvas.height));

        worldTopLeft.floor();
        worldBottomRight.ceil();

        // console.log(worldTopLeft, worldBottomRight);

        this.ctx.fillStyle = "#ccc";
        // Draw the grid
        for (let x = worldTopLeft.x; x < worldBottomRight.x; x += this.grid) {
            for (let y = worldTopLeft.y; y < worldBottomRight.y; y += this.grid) {
                sv = this.WorldToScreen(new Vector2D(x, y));
                this.ctx.fillRect(sv.x, sv.y, 1, 1);
            }
        }

        Shape.worldOffset = this.offset;
        Shape.worldScale = this.scale;

        this.shapes.forEach(shape => {
            shape.renderSelf(this.ctx!);
            shape.renderNodes(this.ctx!, "red");
        });

        if (this.tempShape !== null) {
            this.tempShape.renderSelf(this.ctx);
            this.tempShape.renderNodes(this.ctx, "yellow");
        }

        const curV = this.WorldToScreen(this.cursor);
        this.ctx.strokeStyle = "#fff";
        this.ctx.beginPath();
        this.ctx.arc(curV.x, curV.y, 5, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.strokeStyle = "";
        
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText(`x: ${this.mouse.getCurrentPosition().x}, y: ${this.mouse.getCurrentPosition().y}`, 
                                this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 10);

        this.ctx.fillText(`x: ${this.cursor.x}, y: ${this.cursor.y}`, 
                                this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 20);
    }
}