import Shape                             from "./shapes/shape";
import Node                              from "./shapes/node";
import Line                              from "./shapes/line";
import Rectangle                         from "./shapes/rect";
import Circle                            from "./shapes/circle";
import Ellipse                           from "./shapes/ellipse";
import Bezier                            from "./shapes/bezier";

import Vec2                              from "./utils/vector2d";
import MouseController, { MouseButtons } from "./utils/mouseController";
import KeyboardController                from "./utils/keyboardController";
import { clamp, fastRounding }           from "./utils/math";
import Serializer from "./utils/serializer";
import Drawable from "./shapes/drawable";
import Group from "./shapes/group";

/**
 * Possible engine states
 */
enum EngineState {
    SELECT,
    MOVEPOINT,
    TRANSLATE,
    ROTATE,
    SCALE,
    DRAW,
    GROUP,
    UNGROUP
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
    private viewport:       HTMLDivElement;
    private canvas:         HTMLCanvasElement;
    private canvasUI:       HTMLCanvasElement;
    private ctx:            CanvasRenderingContext2D | null;
    private ctxUI:          CanvasRenderingContext2D | null;
    private mouse:          MouseController;
    private keyboard:       KeyboardController;
    // I hope y'all like polymorphism, there's a lot of it here
    private shapes:         Array<Drawable>;
    private selectedShapes: Set<Drawable>   = new Set<Drawable>();
    private tempShape:      Shape | null = null;
    private selectedNode:   Node | null  = null;
    private scale                        = 10.0;
    private grid                         = 1.0;
    private offset:         Vec2         = new Vec2(0.0, 0.0);
    private cursor:         Vec2;
    private cursorOldPos:   Vec2         = new Vec2(0.0, 0.0);
    public engineState:     EngineState  = EngineState.SELECT;
    public curTypeToDraw:   Shapes       = Shapes.NONE;

    constructor(viewport: HTMLDivElement, width?: number, height?: number) {
        this.viewport      = viewport;
        this.canvas        = viewport.querySelector(".canvas") as HTMLCanvasElement;
        this.canvasUI      = viewport.querySelector(".canvas-ui") as HTMLCanvasElement;
        this.ctx           = this.canvas.getContext("2d");
        this.ctxUI         = this.canvasUI.getContext("2d");

        if (this.ctx === null) throw new Error("error when getting 2d context");
        
        this.shapes        = new Array<Shape>();
        this.mouse         = new MouseController(this.canvasUI);
        this.keyboard      = new KeyboardController();
        this.canvas.width  = width ?? 500;
        this.canvas.height = height ?? 500;
        this.canvasUI.width = width ?? 500;
        this.canvasUI.height = height ?? 500;

        this.cursor = new Vec2(this.canvas.width / 2, this.canvas.height / 2);
    }

    get shapeList(): Array<Drawable> {
        return this.shapes;
    }

    private WorldToScreen(v: Vec2): Vec2 {
        return v.subtract(this.offset).multiply(this.scale);
    }

    private ScreenToWorld(screenCoord: Vec2): Vec2 {
        return screenCoord.divide(this.scale).add(this.offset);
    }

    /**
     * Initialization method, sets up the initial state of the engine
     * @returns {boolean} true if initialization is successful, false otherwise
     */
    public init(): boolean {
        if (this.ctx === null) return false;

        console.log(this.shapes);

        Shape.worldGrid = this.grid;
        this.ctx.lineWidth = 1;

        return true;
    }

    public saveImage(): string | undefined {
        // window.location.href = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        try {
            return this.renderToImage().toDataURL("image/png").replace("image/png", "image/octet-stream");
        } catch(err) {
            console.error(err);
        }
    }

    public save() {
        const shapeArr = [];
        for (let i = 0; i < this.shapes.length; i++) {
            shapeArr.push(Serializer.serialize(this.shapes[i]));
        }

        return {
            offset: this.offset,
            scale: this.scale,
            shapes: shapeArr
        };
    }

    public load(data: any) {
        const arr: Array<Shape> = new Array<Shape>();

        for (const obj of data.shapes) {
            const shape = Serializer.deserialize(obj);
            if (shape != null) {
                arr.push(shape);
            } else {
                throw new TypeError("Shape deserialized to null, check input string for errors");
            }
        }

        this.shapes = [];
        this.shapes = [...arr];
        this.scale = data.scale;
        this.offset = new Vec2(data.offset.x, data.offset.y);
    }

    /**
     * Starts engine's update routine cycle
     */
    public start(): void {
        const updateRoutine = () => {
            try {
                this.update();
                requestAnimationFrame(updateRoutine);
            } catch(e) {
                console.error(e);
                return;
            }
        }

        requestAnimationFrame(updateRoutine);
    }


    /**
     * Update method, has to be run through requestAnimationFrame
     */
    private update(): void {
        const t1 = performance.now();

        // updating
        if (this.mouse.getPressedButton === MouseButtons.MIDDLE) {
            this.mouse.recordPosition();
        }

        if (this.mouse.getHeldButton === MouseButtons.MIDDLE) {
            this.offset = this.offset.subtract(this.mouse.getCurrentPosition()
                                     .subtract(this.mouse.getRecordedPosition()).divide(this.scale * this.grid));
            this.mouse.recordPosition();
        }

        const mouseBeforeZoom = this.ScreenToWorld(Vec2.copyFrom(this.mouse.getCurrentPosition()));
        
        if(this.mouse.mouseScrolled) {
            this.scale += this.mouse.getDelta * -0.2;
            this.scale = clamp(this.scale, 3, 200);
        }
        
        const mouseAfterZoom = this.ScreenToWorld(Vec2.copyFrom(this.mouse.getCurrentPosition()));
        this.offset = this.offset.add(mouseBeforeZoom.subtract(mouseAfterZoom));
        
        this.cursor = mouseAfterZoom.add(new Vec2(0.5, 0.5).multiply(this.grid));
        this.cursor.floor();


        // TODO: Change cursor icon based on engine state
        out:
        if (this.engineState === EngineState.DRAW && this.mouse.getPressedButton === MouseButtons.LEFT) {
            if (this.tempShape === null) {
                switch(this.curTypeToDraw) {
                    case Shapes.LINE: 
                        this.tempShape = new Line("Line " + this.shapes.length);
                        break;
                    case Shapes.RECT:
                        this.tempShape = new Rectangle("Rectangle " + this.shapes.length);
                        break;
                    case Shapes.CIRCLE:
                        this.tempShape = new Circle("Circle " + this.shapes.length);
                        break;
                    case Shapes.ELLIPSE:
                        this.tempShape = new Ellipse("Ellipse " + this.shapes.length);
                        break;
                    case Shapes.BEZIER:
                        this.tempShape = new Bezier("Bezier " + this.shapes.length);
                        break;
                    default:
                        break out;
                }
            }
            // to avoid fuckery with pointers we create a copy of the mouse position
            this.selectedNode = this.tempShape.getNextNode(Vec2.copyFrom(this.cursor));
            // and then we create a second point, but only if our number of points in the shape is currently 1
            if (this.tempShape.numberOfNodes === 1) this.selectedNode = this.tempShape.getNextNode(Vec2.copyFrom(this.cursor));

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
                if (shape instanceof Shape)
                    this.selectedNode = shape.hitNode(this.cursor);
                if (this.selectedNode !== null) break;
            }
        } else if (this.engineState === EngineState.MOVEPOINT && this.mouse.getReleasedButton === MouseButtons.LEFT) {
            this.selectedNode = null;
        }

        if (this.selectedNode !== null) {
            this.selectedNode.setPosition = this.cursor;
        }

        if (this.engineState === EngineState.SELECT) {
            if (this.mouse.getPressedButton === MouseButtons.LEFT) {
                this.cursorOldPos = this.ScreenToWorld(Vec2.copyFrom(this.mouse.getCurrentPosition()));
            }

            if (this.mouse.getHeldButton === MouseButtons.LEFT) {
                this.selectedShapes.clear();
                for (const shape of this.shapes) {
                    shape.setIsSelected = false;
                    if (shape.isInRectangle(this.cursorOldPos, this.cursor)) {
                        shape.setIsSelected = true;
                        this.selectedShapes.add(shape);
                    }
                }
            }
        }

        if (this.engineState === EngineState.TRANSLATE) {
            if (this.mouse.getPressedButton === MouseButtons.LEFT) {
                this.cursorOldPos = Vec2.copyFrom(this.cursor);
            }

            if (this.mouse.getHeldButton === MouseButtons.LEFT) {
                for (const shape of this.selectedShapes) {
                    if (this.cursor.equals(this.cursorOldPos)) break;
                    shape.translate(this.cursor.subtract(this.cursorOldPos));
                }
            }
            this.cursorOldPos = Vec2.copyFrom(this.cursor);
        }

        if (this.engineState === EngineState.SCALE) {
            if (this.mouse.getPressedButton === MouseButtons.LEFT) {
                this.cursorOldPos = Vec2.copyFrom(this.cursor);
            }

            if (this.mouse.getHeldButton === MouseButtons.LEFT) {
                for (const shape of this.selectedShapes) {
                    if (this.cursor.equals(this.cursorOldPos)) break;
                    shape.resize(1, this.cursor);
                }
            }
            this.cursorOldPos = Vec2.copyFrom(this.cursorOldPos);
        }

        if (this.selectedShapes.size != 0) {
            // console.log(this.keyboard.getPressedButton);
            if (this.keyboard.getPressedButton === "Delete") {
                this.shapes = this.shapes.filter(shape => {
                    return !this.selectedShapes.has(shape);
                });

                this.selectedShapes.clear();
            }
        }

        if (this.engineState === EngineState.GROUP && this.shapes.length !== 0) {
            this.shapes.push(new Group("Group", Array.from(this.selectedShapes)));

            this.shapes = this.shapes.filter(shape => {
                return !this.selectedShapes.has(shape);
            });

            this.selectedShapes.clear();
            this.engineState = EngineState.SELECT;
            console.log(this.shapes);
        }

        const updateTime = performance.now() - t1;
        
        // rendering
        this.render(true, updateTime);

        // :)
        this.mouse.resetPressAndRelease();
        this.keyboard.resetKeyController();
    }

    public addToSelection(item: Drawable) {
        this.selectedShapes.add(item);
    }

    public removeFromSelection(item: Drawable) {
        this.selectedShapes.delete(item);
    }

    /**
     * Render method, inteded for file save. Renders the scene on an offscreen canvas
     * of fixed size (but not actual offscreenCanvas, as that feature is not implemented in
     * all browsers yet (Firefox, I'm looking at you ಠ_ಠ))
     * 
     * Might want to offload this to a WebWorker, not that it matters too much
     */
    private renderToImage(): HTMLCanvasElement {
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        // TODO: Create a popup window instead, asking for the dimensions of the file
        canvas.width = 1000;
        canvas.height = 1000;

        // TODO: Scale and center shapes, requires creating a copy of the shapes array
        if (ctx !== null) {
            ctx.fillStyle = "#272d38";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            this.shapes.forEach(shape => {
                shape.renderSelf(ctx);
                shape.renderNodes(ctx);
            });
            ctx.restore();

            return canvas;
        } else {
            throw new Error("Failed to get canvas context");
        }
    }

    // TODO: Split drawing into subroutines, so that this function is not so bloody huge
    /**
     * Render method, gets called at the end of each update
     */
    private render(debug = false, performanceTime?: number): void {
        // console.log(debug);
        if (this.ctx === null || this.ctxUI === null) return;
        const t2 = performance.now();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctxUI.clearRect(0, 0, this.canvasUI.width, this.canvasUI.height);
        // this.ctx.fillStyle = "#191e38";
        this.ctx.fillStyle = "#272d38";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const worldTopLeft: Vec2      = this.ScreenToWorld(new Vec2(0, 0));
        const worldBottomRight: Vec2  = this.ScreenToWorld(new Vec2(this.canvas.width, this.canvas.height));

        worldTopLeft.floor();
        worldBottomRight.ceil();

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

        // Instead of drawing width * height amount of points, we're gonna draw
        // width + height amount of lines, increasing our FPS from ~140 to ~300-400 (or 1-2ms per frame)

        /**
         * Canvas draws lines in an especially retarded way
         * 
         * Assume this is a line from (2,5) to (4,5) on a canvas:
         * 
         *                      0         10
         *                    0 ###########
         *                      #.........#
         *                      #....|....#
         *                      #....|....#
         *                      #....|....#
         *                      #.........#
         *                    6 ###########
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
        this.ctx.save();
        this.ctx.strokeStyle = "#323848";

        let worldX = worldTopLeft.x,
            worldY = worldTopLeft.y;

        // horizontal lines
        for (let i = 0; i < width; i++) {
            const x = fastRounding(sx + offset * i);
            if (worldX % 5 == 0) this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x + 0.5, 0.5);
            this.ctx.lineTo(x + 0.5, this.canvas.height + 0.5);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.lineWidth = 1;
            worldX++;
        }

        // vertical lines
        for (let j = 0; j < height; j++) {
            const y = fastRounding(sy + offset * j);
            if (worldY % 5 == 0) this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(                    0.5, y + 0.5);
            this.ctx.lineTo(this.canvas.width + 0.5, y + 0.5);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.lineWidth = 1;
            worldY++;
        }

        this.ctx.restore();

        this.ctx.save();
            const origin = this.WorldToScreen(new Vec2(0, 0));
            
            this.ctx.strokeStyle = "rgba(0, 150, 150, 1)";
            this.ctx.beginPath();
            this.ctx.arc(origin.x, origin.y, 5, 0, 2 * Math.PI);
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.strokeStyle = "red";
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(origin.x, origin.y + 50);
            this.ctx.closePath();
            this.ctx.stroke();
            
            this.ctx.strokeStyle = "blue";
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(origin.x + 50, origin.y);
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.font = "12px sans-serif";
            this.ctx.fillStyle = "#ccc";
            this.ctx.fillText("x", origin.x + 50, origin.y);
            this.ctx.fillText("y", origin.x, origin.y + 50);
        this.ctx.restore();

        Shape.worldOffset = this.offset;
        Shape.worldScale  = this.scale;

        this.ctx.save();
        if (this.tempShape !== null) {
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

        this.ctx.save();
        if (this.engineState === EngineState.SELECT) {
            if (this.mouse.getHeldButton === MouseButtons.LEFT) {
                const sx = (this.cursorOldPos.x - this.offset.x) * offset;
                const sy = (this.cursorOldPos.y - this.offset.y) * offset;
                const ex = (this.cursor.x       - this.offset.x) * offset;
                const ey = (this.cursor.y       - this.offset.y) * offset;

                // this.ctx.lineWidth = 5;
                this.ctx.strokeStyle = "#fff";
                this.ctx.fillStyle = "rgba(186, 255, 205, 0.2)";
                this.ctx.rect(sx, sy, ex - sx, ey - sy);
                this.ctx.fill();
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
        
        // draw cursor
        const curV = this.WorldToScreen(this.cursor);

        // this.ctx.save();
        //     this.ctx.setLineDash([10, 15]);
        //     this.ctx.strokeStyle = "rgba(100, 100, 100, 0.5)";
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(curV.x, 0);
        //     this.ctx.lineTo(curV.x, this.canvas.height);
        //     this.ctx.closePath();
        //     this.ctx.stroke();
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(0, curV.y);
        //     this.ctx.lineTo(this.canvas.width, curV.y);
        //     this.ctx.closePath();
        //     this.ctx.stroke();
        // this.ctx.restore();
        this.ctxUI.save();
            this.ctxUI.setLineDash([10, 15]);
            this.ctxUI.strokeStyle = "rgba(255, 255, 255, 0.3)";
            this.ctxUI.beginPath();
            this.ctxUI.moveTo(curV.x, 0);
            this.ctxUI.lineTo(curV.x, this.canvas.height);
            this.ctxUI.closePath();
            this.ctxUI.stroke();
            this.ctxUI.beginPath();
            this.ctxUI.moveTo(0, curV.y);
            this.ctxUI.lineTo(this.canvas.width, curV.y);
            this.ctxUI.closePath();
            this.ctxUI.stroke();
        this.ctxUI.restore();


        // this.ctx.save();
        //     this.ctx.strokeStyle = "rgba(150, 150, 150, 0.5)";
        //     this.ctx.beginPath();
        //     this.ctx.arc(curV.x, curV.y, 5, 0, 2 * Math.PI);
        //     this.ctx.closePath();
        //     this.ctx.stroke();
        // this.ctx.restore();

        this.ctxUI.save();
            this.ctxUI.strokeStyle = "rgba(150, 150, 150, 0.5)";
            this.ctxUI.beginPath();
            this.ctxUI.arc(curV.x, curV.y, 5, 0, 2 * Math.PI);
            this.ctxUI.closePath();
            this.ctxUI.stroke();
        this.ctxUI.restore();

        // this.ctx.font = "14px sans-serif";
        // this.ctx.fillStyle = "#fff";
        // this.ctx.fillText(`x: ${this.mouse.getCurrentPosition().x}, y: ${this.mouse.getCurrentPosition().y}`, 
        //                         this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 10);

        // this.ctx.fillText(`x: ${this.cursor.x}, y: ${this.cursor.y}`, 
        //                         this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 25);

        this.ctxUI.font = "14px sans-serif";
        this.ctxUI.fillStyle = "#fff";
        this.ctxUI.fillText(`x: ${this.mouse.getCurrentPosition().x}, y: ${this.mouse.getCurrentPosition().y}`, 
                                this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 10);

        this.ctxUI.fillText(`x: ${this.cursor.x}, y: ${this.cursor.y}`, 
                                this.mouse.getCurrentPosition().x + 10, this.mouse.getCurrentPosition().y + 25);

        const renderTime = performance.now() - t2;

        // for debug purposes
        if (debug) {
            this.ctxUI.font = "18px sans-serif";
            this.ctxUI.fillStyle = "#ccc";
            this.ctxUI.fillText(`Render time (per frame): ${(renderTime).toPrecision(3)}ms`,      10, 20);

            if (performanceTime) 
                this.ctxUI.fillText(`Update time (per frame): ${(performanceTime).toPrecision(3)}ms`, 10, 40);
            
            this.ctxUI.fillText(`FPS: ${Math.trunc(1000 / renderTime)}`,                          10, 60);
            this.ctxUI.fillText(`Shapes on scene: ${this.shapes.length}`,                         10, 80);
            this.ctxUI.fillText(`Temp shape: ${this.tempShape?.name ?? "none"}`,                  10, 100);
            this.ctxUI.fillText(`Selected node: ${this.selectedNode ?? "none"}`,                  10, 120);
            this.ctxUI.fillText(`Zoom level: ${this.scale}`,                                      10, 140);
        }
    }
}

export { EngineState, Shapes }