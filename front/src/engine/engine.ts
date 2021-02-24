import Shape                             from "./shapes/shape";
import Node                              from "./shapes/node";
import Line                              from "./shapes/line";
import Rectangle                         from "./shapes/rect";
import Circle                            from "./shapes/circle";
import Ellipse                           from "./shapes/ellipse";

import Vector2D                          from "./utils/vector2d";
import MouseController, { MouseButtons } from "./utils/mouseController";
import { clamp }                         from "./utils/math";

enum EngineState {
    SELECT,
    MOVEPOINT,
    TRANSLATE,
    ROTATE,
    SCALE,
    DRAW
}

enum Shapes {
    NONE,
    LINE,
    RECT,
    CIRCLE,
    ELLIPSE,
    BEZIER,
    ARC
}

export default class Engine {
    private canvas:        HTMLCanvasElement;
    private ctx:           CanvasRenderingContext2D | null;
    private mouse:         MouseController;
    private shapes:        Array<Shape>;
    private tempShape:     Shape | null = null;
    private selectedNode:  Node | null  = null;
    public engineState: EngineState = EngineState.DRAW;
    public curTypeToDraw: Shapes = Shapes.NONE;
    private scale = 10.0;
    private grid = 1.0;
    private gridImg: HTMLImageElement = new Image();
    private offset: Vector2D = new Vector2D(0.0, 0.0);
    // private startPan: Vector2D = new Vector2D(0.0, 0.0);
    private cursor: Vector2D;
    // private mouseBeforeZoom: Vector2D = new Vector2D(0.0, 0.0);
    // private mouseAfterZoom: Vector2D = new Vector2D(0.0, 0.0);

    constructor(canvas: HTMLCanvasElement, width?: number, height?: number) {
        this.canvas        = canvas;
        this.ctx           = this.canvas.getContext("2d", { alpha: false });
        if (this.ctx === null) throw new Error("error when getting 2d context");
        this.shapes        = new Array<Shape>();
        this.mouse         = new MouseController(this.canvas);
        this.canvas.width  = width ?? 500;
        this.canvas.height = height ?? 500;

        this.cursor = new Vector2D(this.canvas.width / 2, this.canvas.height / 2);
    }

    private WorldToScreen(v: Vector2D): Vector2D {
        return v.subtract(this.offset).multiply(this.scale);
    }

    private ScreenToWorld(screenCoord: Vector2D): Vector2D {
        return screenCoord.divide(this.scale).add(this.offset);
    }

    /**
     * Initialization method, sets up nothing, except my well-beign, yea
     */
    init(): void {
        console.dir(this.shapes);
        Shape.worldGrid = this.grid;
    }

    /**
     * Update method, has to be run through requestAnimationFrame
     */
    update(): void {
        if (this.ctx === null) return;
        const t1 = performance.now();

        // updating
        const mouseBeforeZoom = this.ScreenToWorld(Vector2D.copyFrom(this.mouse.getCurrentPosition()));
        
        if(this.mouse.mouseScrolled) {
            this.scale += this.mouse.getDelta * -0.11;
            this.scale = clamp(this.scale, 10, 50);
        }

        if (this.mouse.getPressedButton === MouseButtons.MIDDLE) {
            this.mouse.recordPosition();
        }

        if (this.mouse.getHeldButton === MouseButtons.MIDDLE) {
            this.offset = this.offset.subtract(this.mouse.getCurrentPosition()
                                     .subtract(this.mouse.getRecordedPosition()).divide(this.scale * this.grid));
            this.mouse.recordPosition();
        }
        
        const mouseAfterZoom = this.ScreenToWorld(Vector2D.copyFrom(this.mouse.getCurrentPosition()));
        this.offset.add(mouseBeforeZoom.subtract(mouseAfterZoom));
        
        this.cursor = mouseAfterZoom.add(new Vector2D(0.5, 0.5).multiply(this.grid));
        this.cursor.floor();

        out:
        if (this.engineState === EngineState.DRAW && this.mouse.getPressedButton === MouseButtons.LEFT) {
            console.log("HAVJHSFGIUGF");
            if (this.tempShape === null) {
                switch(this.curTypeToDraw) {
                    case Shapes.LINE: 
                        this.tempShape = new Line();
                        break;
                    case Shapes.RECT:
                        this.tempShape = new Rectangle();
                        break;
                    case Shapes.CIRCLE:
                        this.tempShape = new Circle();
                        break;
                    case Shapes.ELLIPSE:
                        this.tempShape = new Ellipse();
                        break;
                    default:
                        break out;
                }
            }
            // to avoid fuckery with pointers we create a copy of the mouse position
            this.selectedNode = this.tempShape.getNextNode(Vector2D.copyFrom(this.cursor));
            // and then we just pass a pointer for a second node, because this one needs to move with the mouse
            this.selectedNode = this.tempShape.getNextNode(Vector2D.copyFrom(this.cursor));

            this.tempShape.setNodeColor("yellow");
            console.log(this.tempShape);
        }


        if (this.engineState === EngineState.MOVEPOINT && this.mouse.getPressedButton === MouseButtons.LEFT) {
            this.selectedNode = null;
            for (const shape of this.shapes) {
                this.selectedNode = shape.hitNode(this.cursor);
                if (this.selectedNode !== null) break;
            }
        } else if (this.engineState === EngineState.MOVEPOINT && this.mouse.getReleasedButton === MouseButtons.LEFT) {
            this.selectedNode = null;
        }

        if (this.selectedNode !== null) {
            this.selectedNode.setPosition = this.cursor;
        }


        if (this.mouse.getReleasedButton === MouseButtons.LEFT) {
            if (this.tempShape !== null) {
                // This works, because JS is magic and passes instances of classes exclusively by a pointer.
                // Because of that, I can take a reference (selectedNode), change its position, which will, in turn,
                // change the position of node inside the shape (inside thempShape), which this (selectedNode) is a reference to, 
                // and then overwrite the reference with new node.
                // I have to do this to stop the node from moving with the mouse cursor
                // this.selectedNode.setPosition = Vector2D.copyFrom(this.cursor);
                // Now we try to create a new node, if it even exists
                this.selectedNode = this.tempShape.getNextNode(Vector2D.copyFrom(this.cursor));
                if (this.selectedNode === null) {
                    this.tempShape.color = "#fff";

                    this.tempShape.setNodeColor("red");

                    switch(this.curTypeToDraw) {
                        case Shapes.LINE: 
                            this.shapes.push(Shape.clone<Line>(Line, this.tempShape));
                            break;
                        case Shapes.RECT:
                            this.shapes.push(Shape.clone<Rectangle>(Rectangle, this.tempShape));
                            break;
                        case Shapes.CIRCLE:
                            this.shapes.push(Shape.clone<Circle>(Circle, this.tempShape));
                            break;
                        case Shapes.ELLIPSE:
                            this.shapes.push(Shape.clone<Ellipse>(Ellipse, this.tempShape));
                            break;
                        default:
                            break;
                    }
                    
                    this.tempShape = null;
                }
            } else {
                this.selectedNode = null;
            }
        }   
        
        this.mouse.resetPressAndRelease();

        const updateTime = performance.now() - t1;

        // rendering
        const t2 = performance.now();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#191e38";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // let sv: Vector2D,
        //     ev: Vector2D;

        const worldTopLeft: Vector2D      = this.ScreenToWorld(new Vector2D(0, 0));
        const worldBottomRight: Vector2D  = this.ScreenToWorld(new Vector2D(this.canvas.width, this.canvas.height));

        worldTopLeft.floor();
        worldBottomRight.ceil();

        this.ctx.save();
        this.ctx.fillStyle = "#ccc";

        // I am a mathematical genius
        const sx      = (worldTopLeft.x - this.offset.x)             * this.scale * this.grid;
        const sy      = (worldTopLeft.y - this.offset.y)             * this.scale * this.grid;
        const ex      = (worldTopLeft.x + this.grid - this.offset.x) * this.scale * this.grid;
        const ey      = (worldTopLeft.y + this.grid - this.offset.y) * this.scale * this.grid;
        const offsetX = ex - sx;
        const offsetY = ey - sy;

        const width  = worldBottomRight.x - worldTopLeft.x;
        const height = worldBottomRight.y - worldTopLeft.y;

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                this.ctx.fillRect(sx + offsetX * i, sy + offsetY * j, 1, 1);
            }
        }

        this.ctx.restore();

        Shape.worldOffset = this.offset;
        Shape.worldScale = this.scale;

        this.ctx.save();
        // don't fucking ask me why this has to be this kind of check and not ===
        // it just fucking works, thanks, JS
        if (this.tempShape != null) {
            this.tempShape.renderSelf(this.ctx);
            this.tempShape.renderNodes(this.ctx);
        }
        this.ctx.restore();

        this.ctx.save();
        this.shapes.forEach(shape => {
            shape.renderSelf(this.ctx!);
            shape.renderNodes(this.ctx!);
        });
        this.ctx.restore();

        

        // draw cursor
        const curV = this.WorldToScreen(this.cursor);
        this.ctx.save();
        this.ctx.strokeStyle = "#fff";
        this.ctx.beginPath();
        this.ctx.arc(curV.x, curV.y, 5, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
        
        this.ctx.save();
        this.ctx.font = "14px sans-serif";
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText(`x: ${this.mouse.getCurrentPosition().x}, y: ${this.mouse.getCurrentPosition().y}`, 
                                this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 10);

        this.ctx.fillText(`x: ${this.cursor.x}, y: ${this.cursor.y}`, 
                                this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 25);

        this.ctx.restore();
        const renderTime = performance.now() - t2;


        this.ctx.save();
        this.ctx.font = "18px sans-serif";
        this.ctx.fillStyle = "#ccc";
        this.ctx.fillText(`Update time (per frame): ${Math.trunc(updateTime)}ms`, 10, 20);
        this.ctx.fillText(`Render time (per frame): ${Math.trunc(renderTime)}ms`, 10, 40);
        this.ctx.fillText(`FPS: ${Math.trunc(1000 / renderTime)}`, 10, 60);
        this.ctx.restore();
    }
}

export { EngineState, Shapes }