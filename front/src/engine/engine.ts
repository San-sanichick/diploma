import Serializer                        from "./utils/serializer";
import Drawable                          from "./shapes/drawable";
import Group                             from "./shapes/group";
import Shape                             from "./shapes/shape";
import Node, { NodeColors }                              from "./shapes/node";
import Line                              from "./shapes/line";
import Rectangle                         from "./shapes/rect";
import Circle                            from "./shapes/circle";
import Ellipse                           from "./shapes/ellipse";
import Bezier                            from "./shapes/bezier";

import Vec2                              from "./utils/vector2d";
import MouseController, { MouseButtons } from "./utils/mouseController";
import KeyboardController                from "./utils/keyboardController";
import { clamp, fastRounding }           from "./utils/math";
import Polygon from "./shapes/polygon";
import Polyline from "./shapes/polyline";

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
    UNGROUP,
    WAIT
}

/**
 * Supported shapes
 */
// TODO: Implement ARC and POLYLINE
enum Shapes {
    NONE,
    LINE,
    RECT,
    CIRCLE,
    ELLIPSE,
    BEZIER,
    ARC,
    POLYLINE,
    POLYGON
}

interface Layer {
    id: number;
    name: string;
    layerColor: string;
    shapes: Array<Drawable>;
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
    private currentLayer:         number;
    private layers:         Array<Layer>;
    // private currentLayer:   number;

    private selectedShapes: Set<Drawable> = new Set<Drawable>();
    private tempShape:      Shape | null  = null;
    private selectedNode:   Node | null   = null;
    private scale                         = 10.0;
    private grid                          = 1.0;
    private offset:         Vec2          = new Vec2(0.0, 0.0);
    private cursor:         Vec2;
    private cursorOldPos:   Vec2          = new Vec2(0.0, 0.0);
    private cursorPosPivot: Vec2 | null   = new Vec2(0, 0);
    public  isSnap                        = false;
    public engineState:     EngineState   = EngineState.SELECT;
    public curTypeToDraw:   Shapes        = Shapes.NONE;
    private fps                           = 0;
    private fpsMeasurements: number[]     = [];

    /**
     * Engine constructor. Requires a viewport with two canvases: the UI canvas (class: 'canvas-ui') and
     * main canvas (class: 'canvas').
     * 
     * Additionally, width and height of the vewport can be specified,
     * but if this width and heigh does not match the width and height, specified by CSS properties of
     * the viewport, then the view will be distorted to fit
     * 
     * @param viewport Viewport div with two canvases: the UI canvas, and the active canvas, 
     * on which everything will be drawn
     * @param width optional width of the viewport
     * @param height optonal height of the viewport
     */
    constructor(viewport: HTMLDivElement, width?: number, height?: number) {
        this.viewport      = viewport;
        this.canvas        = viewport.querySelector(".canvas") as HTMLCanvasElement;
        this.canvasUI      = viewport.querySelector(".canvas-ui") as HTMLCanvasElement;
        this.ctx           = this.canvas.getContext("2d", { alpha: false });
        this.ctxUI         = this.canvasUI.getContext("2d");
        

        if (this.ctx === null || this.ctxUI === null) throw new Error("An error has occured while gitting context from canvas");
        
        // if ( this.ctx.imageSmoothingEnabled && this.ctxUI.imageSmoothingEnabled) {
        //     console.log("supported");
        //     this.ctx.imageSmoothingEnabled = true;
        //     this.ctx.imageSmoothingQuality = "high";
        //     this.ctxUI.imageSmoothingEnabled = true;
        //     this.ctxUI.imageSmoothingQuality = "low";
        // }

        
        this.layers = new Array<Layer>();
        // console.log(object);

        this.layers.push({
            id: 0,
            layerColor: "white",
            name: "Layer 0",
            shapes: new Array<Drawable>()
        });
        this.currentLayer = 0;
        // this.currentLayer = 0;

        this.mouse         = new MouseController(this.canvasUI);
        this.keyboard      = new KeyboardController();

        const w = parseInt(getComputedStyle(this.viewport).width);
        const h = parseInt(getComputedStyle(this.viewport).height);
        this.canvas.width  = width ?? w;
        this.canvas.height = height ?? h;
        this.canvasUI.width = width ?? w;
        this.canvasUI.height = height ?? h;

        // we don't want to hardcode the size of the window, so we add
        // an event listener for the resize event
        if (width === undefined && height === undefined) {
            new ResizeObserver(() => {
                const w = parseInt(getComputedStyle(this.viewport).width);
                const h = parseInt(getComputedStyle(this.viewport).height);
                this.canvas.width  = w;
                this.canvas.height = h;
                this.canvasUI.width = w;
                this.canvasUI.height = h;

                // force redraw, beacuse otherwise there is flickering
                // see https://stackoverflow.com/questions/3543358/resizing-a-html-canvas-blanks-its-contents
                this.render();
            }).observe(this.viewport);
        }

        this.cursor = new Vec2(this.canvas.width / 2, this.canvas.height / 2);
    }

    get shapeList(): Array<Drawable> {
        // return this.layers[0].shapes;
        if (this.layers) {
            if (this.layers[this.currentLayer]) {
                return this.layers[this.currentLayer].shapes;
            }
        }
        return [];
    }

    get layerList(): Array<{ id: number; name: string; layerColor: string; size: number }> {
        const arr = [];
        for (const layer of this.layers) {
            arr.push({
                id: layer.id,
                name: layer.name,
                layerColor: layer.layerColor,
                size: layer.shapes.length
            })
        }
        return arr;
    }

    public addLayer() {
        this.layers.push({
            id: this.layers.length + 1,
            name: "Layer " + (this.layers[this.layers.length - 1].id + 1),
            layerColor: `rgba(${(50 + Math.random() * 100).toFixed(3)}, ${(50 + Math.random() * 100).toFixed(3)},${(50 + Math.random() * 100).toFixed(3)}, 1)`,
            shapes: []
        })
    }

    public removeLayer(id: number) {
        this.layers = this.layers.filter(layer => layer.id !== id);
        this.currentLayer = this.layers[this.layers.length - 1].id;
        this.selectedShapes.clear();
    }

    get getLayerIndex(): number {
        return this.layers.indexOf(this.layers.find(l => l.id === this.currentLayer)!);
    }

    get getCurLayer(): number {
        return this.currentLayer;
    }

    set setCurLayer(val: number) {
        this.currentLayer = val;
        this.selectedShapes.clear();
    }

    get selectedElements() {
        return Array.from(this.selectedShapes);
    }

    get mouseCoordinates() {
        return this.cursor;
    }

    public scaleValue(val?: number) {
        if (val === undefined) return this.scale;

        this.scale = val;
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

        Shape.worldGrid = this.grid;
        this.ctx.lineWidth = 1;
        this.ctx.translate(0.5, 0.5);

        return true;
    }

    public saveImage(): string | undefined {
        // window.location.href = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        try {
            return this.renderToImage(1000, 1000).toDataURL("image/png").replace("image/png", "image/octet-stream");
        } catch(err) {
            console.error(err);
        }
    }

    public save() {

        const layers = [];
        for (const layer of this.layers) {
            layers.push({
                id: layer.id,
                layerColor: layer.layerColor,
                name: layer.name,
                shapes: Serializer.serialize(layer.shapes)
            })
        }

        return {
            offset: this.offset,
            scale: this.scale,
            image: this.renderToImage(800, 400).toDataURL(),
            layers
        }
    }

    public load(data: { offset: {x: number; y: number}; scale: number; layers: any[] }) {
        // this.currentLayer = [];
        this.selectedShapes.clear();
        if (data.layers.length !== 0) {
            this.layers = [];

            for (const layer of data.layers) {
                this.layers.push({
                    id: layer.id,
                    layerColor: layer.layerColor,
                    name: layer.name,
                    shapes: Serializer.deserialize(layer.shapes)
                })
            }
        }

        this.scale = data.scale;
        this.offset = new Vec2(data.offset.x, data.offset.y);
    }

    /**
     * Starts engine's update routine cycle
     */
    public start(): void {
        const updateRoutine = () => {
            // try {
            //     this.update();
            //     requestAnimationFrame(updateRoutine);
            // } catch(e) {
            //     console.error(e);
            //     return;
            // }
            this.update();
            requestAnimationFrame(updateRoutine);
        }

        requestAnimationFrame(updateRoutine);
    }

    // this is quite silly, really
    private hotKeyStateSwitchHandler() {
        switch(this.keyboard.getPressedButton) {
            case "KeyA":
                this.engineState = EngineState.SELECT;
                break;
            case "KeyV":
                this.engineState = EngineState.MOVEPOINT;
                break;
            case "KeyM":
                this.engineState = EngineState.TRANSLATE;
                break;
            case "KeyR":
                this.engineState = EngineState.ROTATE;
                break;
            case "KeyS":
                this.engineState = EngineState.SCALE;
                break;
            default: return;
        }

    }

    /**
     * Update method, has to be run through requestAnimationFrame
     */
    // TODO: Split updating into subroutines, so that this function is not so bloody huge as well
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
        
        if (this.mouse.mouseScrolled) {
            this.scale += this.mouse.getDelta * -0.05;
            this.scale = clamp(this.scale, 3, 200);
        }
        
        const mouseAfterZoom = this.ScreenToWorld(Vec2.copyFrom(this.mouse.getCurrentPosition()));
        this.offset = this.offset.add(mouseBeforeZoom.subtract(mouseAfterZoom));
        
        this.cursor = mouseAfterZoom.add(new Vec2(0, 0).multiply(this.grid));
        // this.cursor.floor();
        if (this.isSnap) this.cursor.floor();

        this.hotKeyStateSwitchHandler();

        // TODO: Change cursor icon based on engine state
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
                    case Shapes.POLYGON: {
                        // not the most elegant solution
                        const verticies = prompt("Введите число вершин", "4");
                        let val = parseInt(verticies ? verticies : "4");
                        val = clamp(val, 3, 100);
                        this.tempShape = new Polygon("Polygon", val);
                        break;
                    }
                    case Shapes.POLYLINE:
                        this.tempShape = new Polyline();
                        break;
                    default:
                        break out;
                }
            }
            // to avoid fuckery with pointers we create a copy of the mouse position
            this.selectedNode = this.tempShape.getNextNode(Vec2.copyFrom(this.cursor));
            // and then we create a second point, but only if our number of points in the shape is currently 1
            if (this.tempShape.numberOfNodes === 1) this.selectedNode = this.tempShape.getNextNode(Vec2.copyFrom(this.cursor));

            this.tempShape.setNodeColor(NodeColors.ACTIVE);
        }

        // this works
        if (this.mouse.getReleasedButton === MouseButtons.RIGHT) {
            if (this.tempShape !== null) {
                if (this.tempShape instanceof Polyline) {
                    this.tempShape.setMaxNodeNumber = this.tempShape.numberOfNodes;
                    this.tempShape.setNodeColor(NodeColors.INACTIVE);
                    this.tempShape.color = "#fff";
                    // this.layers[this.currentLayer].shapes.push(this.tempShape)
                    this.layers[this.getLayerIndex].shapes.push(this.tempShape)
                    this.tempShape = null;
                    this.selectedNode = null;
                }
            }
        }

        if (this.mouse.getReleasedButton === MouseButtons.LEFT) {
            if (this.tempShape !== null) {
                if (this.selectedNode === null) {
                    console.log("HAHAHAHAHHAHHA", this.layers);
                    this.tempShape.color = "#fff";

                    this.tempShape.setNodeColor(NodeColors.INACTIVE);

                    switch(this.curTypeToDraw) {
                        case Shapes.LINE:
                            this.layers[this.getLayerIndex].shapes.push(this.tempShape)
                            break;
                        case Shapes.RECT:
                            this.layers[this.getLayerIndex].shapes.push(this.tempShape)
                            break;
                        case Shapes.CIRCLE:
                            this.layers[this.getLayerIndex].shapes.push(this.tempShape)
                            break;
                        case Shapes.ELLIPSE:
                            this.layers[this.getLayerIndex].shapes.push(this.tempShape)
                            break;
                        case Shapes.BEZIER:
                            this.layers[this.getLayerIndex].shapes.push(this.tempShape)
                            break;
                        case Shapes.POLYGON:
                            this.layers[this.getLayerIndex].shapes.push(this.tempShape)
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

        // TODO: Make nodes deletable (is that even a word?)
        if (this.engineState === EngineState.MOVEPOINT && this.mouse.getPressedButton === MouseButtons.LEFT) {
            this.selectedNode = null;
            for (const shape of this.layers[this.getLayerIndex].shapes) {
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
                for (const shape of this.layers[this.getLayerIndex].shapes) {
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
                this.cursorPosPivot = Vec2.copyFrom(this.cursor);
            }

            if (this.mouse.getHeldButton === MouseButtons.LEFT && this.cursorPosPivot !== null) {
                for (const shape of this.selectedShapes) {
                    if (this.cursor.equals(this.cursorOldPos)) break;
                    shape.resize(this.cursor.subtract(this.cursorPosPivot), this.cursorPosPivot);
                }
            }
            this.cursorOldPos = Vec2.copyFrom(this.cursor);
        }

        if (this.engineState === EngineState.ROTATE) {
            if (this.mouse.getPressedButton === MouseButtons.LEFT) {
                this.cursorOldPos = Vec2.copyFrom(this.cursor);
                this.cursorPosPivot = Vec2.copyFrom(this.cursor);
            }

            if (this.mouse.getHeldButton === MouseButtons.LEFT && this.cursorPosPivot !== null) {
                for (const shape of this.selectedShapes) {
                    if (this.cursor.equals(this.cursorOldPos)) break;
                    // const a = new Vec2(this.cursorPosPivot.x + 2, this.cursorPosPivot.y).subtract(this.cursorPosPivot);
                    // const b = this.cursorPosPivot.subtract(this.cursor);

                    // const angle1 = Math.atan2(a.y, a.x);
                    // const angle2 = Math.atan2(b.y, b.x);


                    // const angle = angle1 - angle2;

                    shape.rotate(-this.cursor.subtract(this.cursorOldPos).x / 100, this.cursorPosPivot);
                }
            } else {
                this.cursorPosPivot = null;
            }
            this.cursorOldPos = Vec2.copyFrom(this.cursor);
        }

        if (this.selectedShapes.size != 0) {
            if (this.keyboard.getPressedButton === "Delete") {
                this.layers[this.getLayerIndex].shapes = this.layers[this.getLayerIndex].shapes.filter(shape => {
                    return !this.selectedShapes.has(shape);
                });

                this.selectedShapes.clear();
            }
        }

        if (this.keyboard.isCtrlHeld && !this.keyboard.isAltHeld && this.keyboard.getPressedButton === "KeyG") {
            this.engineState = EngineState.GROUP;
        } else if (this.keyboard.isCtrlHeld && this.keyboard.isAltHeld && this.keyboard.getPressedButton === "KeyG") {
            this.engineState = EngineState.UNGROUP;
        }

        if (this.engineState === EngineState.GROUP) {
            this.group();
        }

        if (this.engineState === EngineState.UNGROUP) {
            this.ungroup();
        }

        const updateTime = performance.now() - t1;
        
        // rendering
        const t2 = performance.now();
        this.fpsMeasurements.push(t2);
        this.render();
        
        // uhh, better fps measurment, I guess?
        const msPassed = this.fpsMeasurements[this.fpsMeasurements.length - 1] - this.fpsMeasurements[0];
        if (msPassed >= 1000) {
            this.fps = 1000 / (performance.now() - t2);
            this.fpsMeasurements = [];
        }

        this.renderDebug({ text: "FPS", metric: fastRounding(this.fps) },
                         { text: "Render time", metric: `${(performance.now() - t2).toFixed(3)}ms` },
                         { text: "Update time", metric: `${updateTime.toFixed(3)}ms` },
                         { text: "Scale level", metric: this.scale },
                         { text: "Current layer", metric: this.currentLayer },
                         { text: "Shapes on layer", metric: this.layers[this.getLayerIndex].shapes.length });

        
        // :)
        this.mouse.resetMouseController();
        this.keyboard.resetKeyController();
    }

    public group() {
        if (this.selectedElements.length !== 0) {
            this.layers[this.getLayerIndex].shapes.push(new Group("Group", Array.from(this.selectedShapes)));

            this.layers[this.getLayerIndex].shapes = this.layers[this.getLayerIndex].shapes.filter(shape => {
                return !this.selectedShapes.has(shape);
            });

            this.selectedShapes.clear();
            this.engineState = EngineState.SELECT;
        }
    }

    public ungroup() {
        if (this.selectedShapes.size === 1) {
            const obj = Array.from(this.selectedShapes)[0];

            if(obj instanceof Group) {
                const group = obj as Group;
                for (const shape of group.getObjects) {
                    shape.setIsSelected = false;
                    this.layers[this.getLayerIndex].shapes.push(shape);
                }

                this.selectedShapes.clear();
                this.layers[this.getLayerIndex].shapes.splice(this.layers[this.getLayerIndex].shapes.indexOf(group), 1);
                this.engineState = EngineState.SELECT;
            }
        }
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
    private renderToImage(width: number, height: number): HTMLCanvasElement {
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        // canvas.width = width * 4;
        // canvas.height = height * 4;
        canvas.width = width;
        canvas.height = height;

        // const shapesCopy = Serializer.deserialize(Serializer.serialize(this.shapes));

        // TODO: Scale and center shapes, requires creating a copy of the shapes array
        // TODO: Which is gonna be hell, thanks javascript
        if (ctx !== null) {
            ctx.fillStyle = "#003236";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.setTransform(1, 0, 0, -1, 0, this.canvas.height);

            ctx.save();
            // this.currentLayer.forEach(shape => {
            //     shape.renderSelf(ctx);
            //     // shape.renderNodes(ctx);
            // });
            this.layers.forEach(layer => {
                layer.shapes.forEach(shape => {
                    shape.renderSelf(ctx);
                })
            })
            ctx.restore();

            // const resCanvas = document.createElement("canvas") as HTMLCanvasElement;
            // resCanvas.width = width;
            // resCanvas.height = height;
            // resCanvas.getContext("2d")?.drawImage(canvas, 0, 0, width, height);

            // return resCanvas;
            return canvas;
        } else {
            throw new Error("Failed to get canvas context");
        }
    }

    // TODO: Split drawing into subroutines, so that this function is not so bloody huge
    /**
     * Render method, gets called at the end of each update
     * 
     * Important note: during render, the Y coordinate is flipped
     */
    private render(): void {
        if (this.ctx === null || this.ctxUI === null) return;

        // ! Modern problems require modern solutions. Although, frankly,
        // ! idfk how to do this better
        this.ctx.setTransform(1, 0, 0, -1, 0, this.canvas.height);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctxUI.clearRect(0, 0, this.canvasUI.width, this.canvasUI.height);
        this.ctx.fillStyle = "#003236";
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
        // width + height amount of LINES, increasing our FPS from ~140 to ~300-400 (or 1-2ms per frame)

        /**
         * Canvas draws lines in an especially retarded way
         * 
         * Assume this is a line from (2,5) to (4,5) on a canvas:
         * 
         *                      012345678910
         *                    0 ###########
         *                    1 #.........#
         *                    2 #....|....#
         *                    3 #....|....#
         *                    4 #....|....#
         *                    5 #.........#
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
        this.ctx.strokeStyle = "#173f42";
        // this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";

        let worldX = worldTopLeft.x,
            worldY = worldTopLeft.y;

        const gridOffset = 0.5;

        // let gridWidth = 1;

        // if (this.scale >= 1 && this.scale <= 10)  gridWidth = 2;
        // if (this.scale > 10 && this.scale <= 20) gridWidth = 4;
        // if (this.scale > 20 && this.scale <= 40) gridWidth = 3;
        // if (this.scale > 40 && this.scale <= 80) gridWidth = 2;
        // if (this.scale > 80 && this.scale <= 160) gridWidth = 1;

        // horizontal lines
        for (let i = 0; i < width; i++) {
            const x = fastRounding(sx + offset * i);
            if (worldX % 5 == 0) this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x + gridOffset, gridOffset);
            this.ctx.lineTo(x + gridOffset, this.canvas.height + gridOffset);
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
            this.ctx.moveTo(                    gridOffset, y + gridOffset);
            this.ctx.lineTo(this.canvas.width + gridOffset, y + gridOffset);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.lineWidth = 1;

            worldY++;
        }

        this.ctx.restore();

        // this.ctx.save();
            const origin = this.WorldToScreen(new Vec2(0, 0));
            
            this.ctx.strokeStyle = "rgba(0, 150, 150, 1)";
            this.ctx.beginPath();
            this.ctx.rect(origin.x - 5, origin.y - 5, 10, 10);
            // this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.strokeStyle = "rgba(255, 0, 0, 1)";
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(origin.x, origin.y + 50);
            this.ctx.closePath();
            this.ctx.stroke();
            
            this.ctx.strokeStyle = "rgba(0, 0, 255, 1)";
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(origin.x + 50, origin.y);
            this.ctx.closePath();
            this.ctx.stroke();

            // this monstrosity, because otherwise the text is drawn upside-down,
            // which is hillarious, and also undesirable
            this.ctx.save();
                this.ctx.font = "16px Open Sans";
                this.ctx.fillStyle = "#ccc";
                this.ctx.translate(origin.x + 50, origin.y);
                this.ctx.scale(1, -1);
                this.ctx.fillText("X", 0, 0);
                this.ctx.scale(1, -1);
                this.ctx.translate(-(origin.x + 50), -origin.y);
                this.ctx.translate(origin.x, origin.y + 50);
                this.ctx.scale(1, -1);
                this.ctx.fillText("Y", 0, 0);
            this.ctx.restore();

        Shape.worldOffset = this.offset;
        Shape.worldScale  = this.scale;

        this.ctx.lineWidth = 1;

        // this.ctx.save();
        if (this.tempShape !== null) {
            this.tempShape.renderSelf(this.ctx);
            this.tempShape.renderNodes(this.ctx);
        }
        // this.ctx.restore();

        this.ctx.save();
            // can't use forEach, TS is screaming abount ctx being possibly null
            // what a bloody idiot
            // for (const shape of this.currentLayer) {
            //     shape.renderSelf(this.ctx);
            //     shape.renderNodes(this.ctx);
            // }

            for (const layer of this.layers) {
                for (const shape of layer.shapes) {
                    shape.renderSelf(this.ctx, layer.layerColor);
                    shape.renderNodes(this.ctx);
                }
            }
        this.ctx.restore();

        this.ctx.save();
        if (this.engineState === EngineState.SELECT) {
            if (this.mouse.getHeldButton === MouseButtons.LEFT) {
                const sx = (this.cursorOldPos.x - this.offset.x) * offset;
                const sy = (this.cursorOldPos.y - this.offset.y) * offset;
                const ex = (this.cursor.x       - this.offset.x) * offset;
                const ey = (this.cursor.y       - this.offset.y) * offset;

                // this.ctx.lineWidth = 5;
                this.ctxUI.beginPath();
                this.ctx.strokeStyle = "#fff";
                this.ctx.fillStyle = "rgba(186, 255, 205, 0.2)";
                this.ctx.rect(sx, sy, ex - sx, ey - sy);
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.strokeStyle = "";
                this.ctx.fillStyle = "";
            }
        }
        this.ctx.restore();

        // if (this.engineState === EngineState.ROTATE && this.cursorPosPivot !== null) {
        //     this.ctxUI.save();
        //         const sx = (this.cursorPosPivot.x - this.offset.x) * offset;
        //         const sy = (this.cursorPosPivot.y - this.offset.y) * offset;
        //         const ex = (this.cursor.x       - this.offset.x) * offset;
        //         const ey = (this.cursor.y       - this.offset.y) * offset;

        //         this.ctxUI.beginPath();
        //         this.ctxUI.strokeStyle = "rgba(80, 20, 30, 1)";
        //         this.ctxUI.moveTo(sx, sy);
        //         this.ctxUI.lineTo(ex, ey);
        //         this.ctxUI.closePath();
        //         this.ctxUI.stroke();
        //     this.ctxUI.restore();
        // }
        
        // draw cursor
        this.ctxUI.transform(1, 0, 0, -1, 0, this.canvasUI.height);
        const curV = this.WorldToScreen(this.cursor);

        this.ctxUI.save();
            this.ctxUI.setLineDash([5, 15]);
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

        this.ctxUI.save();
            this.ctxUI.strokeStyle = "rgba(255, 255, 255, 1)";
            this.ctxUI.beginPath();
            this.ctxUI.strokeRect(curV.x - 6, curV.y - 6, 12, 12);
            this.ctxUI.closePath();
            // this.ctxUI.stroke();
        this.ctxUI.restore();

        this.ctxUI.transform(1, 0, 0, -1, 0, this.canvasUI.height);
    }

    private renderDebug(...performance: { text: string; metric: number | string }[]) {
        if (this.ctxUI === null) return;

        const gap = 20;
        this.ctxUI.font = "18px Open Sans";
        this.ctxUI.fillStyle = "#ccc";

        for (let i = 0; i < performance.length; i++) {
            const perf = performance[i];
            const metric = perf.metric;
            this.ctxUI?.fillText(`${perf.text}: ${metric}`, 20, gap * (2 + i));
        }
    }
}

export { EngineState, Shapes }