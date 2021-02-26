import Shape                             from "./shapes/shape";
import Node                              from "./shapes/node";
import Line                              from "./shapes/line";
import Rectangle                         from "./shapes/rect";
import Circle                            from "./shapes/circle";
import Ellipse                           from "./shapes/ellipse";
import Bezier                            from "./shapes/bezier";

import Vector2D                          from "./utils/vector2d";
import MouseController, { MouseButtons } from "./utils/mouseController";
import { clamp, fastRounding }           from "./utils/math";

/**
 * Possible engine states
 */
enum EngineState {
    SELECT,
    MOVEPOINT,
    TRANSLATE,
    ROTATE,
    SCALE,
    DRAW
}

/**
 * Supported shapes
 */
enum Shapes {
    NONE,
    LINE,
    RECT,
    CIRCLE,
    ELLIPSE,
    BEZIER,
    ARC
}

/**
 * CAD engine class
 * @class
 */
export default class Engine {
    private canvas:        HTMLCanvasElement;
    private ctx:           CanvasRenderingContext2D | null;
    private mouse:         MouseController;
    private shapes:        Array<Shape>;
    private tempShape:     Shape | null = null;
    private selectedNode:  Node | null  = null;
    private scale = 10.0;
    private grid = 1.0;
    private offset: Vector2D = new Vector2D(0.0, 0.0);
    private cursor: Vector2D;
    public engineState: EngineState = EngineState.DRAW;
    public curTypeToDraw: Shapes = Shapes.NONE;

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
    public init(): void {
        console.dir(this.shapes);
        Shape.worldGrid = this.grid;
    }

    /**
     * Update method, has to be run through requestAnimationFrame
     */
    public update(): void {
        // const t1 = performance.now();

        // updating
        if (this.mouse.getPressedButton === MouseButtons.MIDDLE) {
            this.mouse.recordPosition();
        }

        if (this.mouse.getHeldButton === MouseButtons.MIDDLE) {
            this.offset = this.offset.subtract(this.mouse.getCurrentPosition()
                                     .subtract(this.mouse.getRecordedPosition()).divide(this.scale * this.grid));
            this.mouse.recordPosition();
        }

        const mouseBeforeZoom = this.ScreenToWorld(Vector2D.copyFrom(this.mouse.getCurrentPosition()));
        
        if(this.mouse.mouseScrolled) {
            this.scale += this.mouse.getDelta * -0.11;
            this.scale = clamp(this.scale, 9, 50);
        }
        
        const mouseAfterZoom = this.ScreenToWorld(Vector2D.copyFrom(this.mouse.getCurrentPosition()));
        this.offset = this.offset.add(mouseBeforeZoom.subtract(mouseAfterZoom));
        
        this.cursor = mouseAfterZoom.add(new Vector2D(0, 0).multiply(this.grid));
        this.cursor.floor();

        out:
        if (this.engineState === EngineState.DRAW && this.mouse.getPressedButton === MouseButtons.LEFT) {
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
                    case Shapes.BEZIER:
                        this.tempShape = new Bezier();
                        break;
                    default:
                        break out;
                }
            }
            // to avoid fuckery with pointers we create a copy of the mouse position
            this.selectedNode = this.tempShape.getNextNode(Vector2D.copyFrom(this.cursor));
            // and then we create a second point, but only if our number of points in the shape is currently 1
            if (this.tempShape.numberOfNodes === 1) this.selectedNode = this.tempShape.getNextNode(Vector2D.copyFrom(this.cursor));

            this.tempShape.setNodeColor("yellow");
        }


        if (this.mouse.getReleasedButton === MouseButtons.LEFT) {
            if (this.tempShape !== null) {
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
                        case Shapes.BEZIER:
                            this.shapes.push(Shape.clone<Bezier>(Bezier, this.tempShape));
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
        
        this.mouse.resetPressAndRelease();

        // const updateTime = performance.now() - t1;

        // rendering
        this.render();
    }

    /**
     * Render method, gets called at the end of each update
     */
    private render(): void {
        if (this.ctx === null) return;
        const t2 = performance.now();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#191e38";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const worldTopLeft: Vector2D      = this.ScreenToWorld(new Vector2D(0, 0));
        const worldBottomRight: Vector2D  = this.ScreenToWorld(new Vector2D(this.canvas.width, this.canvas.height));

        worldTopLeft.floor();
        worldBottomRight.ceil();

        this.ctx.save();
        this.ctx.strokeStyle = "#2c3563";

        // I am a mathematical genius
        // This approach gives a goddamn 4x (4 times, 4 TIMES, FOUR TIMES) speed boost
        // over brute force calculation of coordinates for each point on the grid,
        // over all ending up at ~140fps, with 6-7ms per frame, which is bloody brilliant
        // if I can optimize this even further, this could be great
        // TODO: Zoom levels could still be a good idea
        const offset = this.grid * this.scale;
        const sx     = (worldTopLeft.x - this.offset.x) * offset;
        const sy     = (worldTopLeft.y - this.offset.y) * offset;

        const width  = worldBottomRight.x - worldTopLeft.x;
        const height = worldBottomRight.y - worldTopLeft.y;

        // for (let i = 0; i < width; i++) {
        //     for (let j = 0; j < height; j++) {
        //         this.ctx.fillRect(sx + offset * i, sy + offset * j, 1, 1);
        //     }
        // }



        // Instead of drawing width * height amount of points, we're gonna draw
        // width + height amount of lines, increasing our FPS from ~140 to ~300-400 (or 1-2ms per frame)

        /**
         * Canvas draws lines in an especially retarded way
         * 
         * Assume this is a line from (2,5) to (4,5) on a canvas:
         * 
         *   0         10
         * 0 ###########
         *   #.........#
         *   #....|....#
         *   #....|....#
         *   #....|....#
         *   #.........#
         * 6 ###########
         * 
         * A normal person would assume that the dots are pixels, but not JS.
         * JS assumes that dots are BOUNDARIES of the pixels, and draws ON THEM.
         * As in, draws INBETWEEN PIXELS.
         * What happens, when you try to draw inbetween pixels?
         * That's right, you have to fill in both pixels on the right, and on the left of the
         * boundary. So you end up with double the width.
         * Let me get this straigh: you set the line thickness to ONE. PIXEl.
         * And end up with TWO. PIXEL. WIDTH.
         * 
         * WHY IS THIS A THING????!!!!
         * 
         * Ahem. So in order to avoid that, we calculate the coordinates, round them, and then add 0.5
         * to offset them from the boundary to the actual bloody pixel, so we end up with
         * ONE. PIXEL. WIDTH.
         */
        this.ctx.lineWidth = 1;

        // horizontal lines
        for (let i = 0; i < width; i++) {
            const x = fastRounding(sx + offset * i);
            this.ctx.moveTo(x + 0.5, 0.5);
            this.ctx.lineTo(x + 0.5, this.canvas.height + 0.5);
            this.ctx.stroke();
        }

        // vertical lines
        for (let j = 0; j < height; j++) {
            const y = fastRounding(sy + offset * j);
            this.ctx.moveTo(                    0.5, y + 0.5);
            this.ctx.lineTo(this.canvas.width + 0.5, y + 0.5);
            this.ctx.stroke();
        }

        this.ctx.restore();

        Shape.worldOffset = this.offset;
        Shape.worldScale = this.scale;

        // this.ctx.save();
        if (this.tempShape !== null) {
            this.tempShape.renderSelf(this.ctx);
            this.tempShape.renderNodes(this.ctx);
        }
        // this.ctx.restore();

        // this.ctx.save();
        this.shapes.forEach(shape => {
            shape.renderSelf(this.ctx!);
            shape.renderNodes(this.ctx!);
        });
        // this.ctx.restore();

        
        // draw cursor
        const curV = this.WorldToScreen(this.cursor);

        this.ctx.save();
            this.ctx.setLineDash([10, 15]);
            this.ctx.strokeStyle = "#ccc";
            this.ctx.beginPath();
            this.ctx.moveTo(curV.x, 0);
            this.ctx.lineTo(curV.x, this.canvas.height);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, curV.y);
            this.ctx.lineTo(this.canvas.width, curV.y);
            this.ctx.closePath();
            this.ctx.stroke();
        this.ctx.restore();

        this.ctx.strokeStyle = "#fff";
        this.ctx.beginPath();
        this.ctx.arc(curV.x, curV.y, 5, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.stroke();
        
        this.ctx.font = "14px sans-serif";
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText(`x: ${this.mouse.getCurrentPosition().x}, y: ${this.mouse.getCurrentPosition().y}`, 
                                this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 10);

        this.ctx.fillText(`x: ${this.cursor.x}, y: ${this.cursor.y}`, 
                                this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 25);

        const renderTime = performance.now() - t2;


        // for debug purposes
        this.ctx.font = "18px sans-serif";
        this.ctx.fillStyle = "#ccc";
        this.ctx.fillText(`Render time (per frame): ${Math.trunc(renderTime)}ms`, 10, 20);
        this.ctx.fillText(`FPS: ${Math.trunc(1000 / renderTime)}`,                10, 40);
        this.ctx.fillText(`Shapes on scene: ${this.shapes.length}`,               10, 60);
        this.ctx.fillText(`Temp shape: ${this.tempShape?.name ?? "none"}`,        10, 80);
        this.ctx.fillText(`Selected node: ${this.selectedNode ?? "none"}`,        10, 100);
    }
}

export { EngineState, Shapes }