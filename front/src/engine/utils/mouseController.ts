import Vec2 from "./vector2d";
import { clamp } from "./math";

enum MouseButtons {
    LEFT,
    MIDDLE,
    RIGHT
}

export default class MouseController {
    private curPos: Vec2;
    private oldPos: Vec2;

    private delta                         = 0;
    private oldDelta                      = 0;

    private mouseWheelStep                = 20;

    private isOnCanvas                    = false;
    private isPressed                     = false;
    private isHeld                        = false;
    private isReleased                    = false;
    private heldButton: number | null     = null;
    private releasedButton: number | null = null;
    private pressedButton: number | null  = null;

    constructor(canvas: HTMLCanvasElement) {
        this.curPos = new Vec2(0, 0);
        this.oldPos = new Vec2(0, 0);
        canvas.addEventListener("mousemove", (e) => {
            const boundingRect = canvas.getBoundingClientRect();
            this.curPos.x = e.clientX - boundingRect.x;
            // inverse of regular y coord, otherwise it is upside-down
            this.curPos.y = (boundingRect.bottom - e.clientY);
        });

        canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            this.oldDelta = this.delta;
            if (e.deltaY > 0) {
                this.delta += this.mouseWheelStep
            } else if (e.deltaY < 0) {
                this.delta -= this.mouseWheelStep;
            }
        });

        canvas.addEventListener("mousedown", (e) => {
            e.preventDefault();
            // console.log("down");
            this.heldButton = e.button;
            this.pressedButton = e.button;
            this.isPressed = true;

            this.releasedButton = null;
            this.isHeld = true;
        });

        canvas.addEventListener("mouseup", (e) => {
            e.preventDefault();
            this.releasedButton = e.button;
            this.heldButton = null;
            this.isHeld = false;
            this.isReleased = true;
        });

        canvas.addEventListener("mouseover", () => {
            this.isOnCanvas = true;
        });

        canvas.addEventListener("mouseleave", () => {
            this.isOnCanvas = false;
        })

        canvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        })
    }

    get mouseScrolled() {
        return this.oldDelta != this.delta;
    }

    get getDelta() {
        const temp = this.delta;
        this.oldDelta = this.delta;
        this.delta = 0;
        return clamp(temp, -100, 100);
    }

    get getIsOnCanvas() {
        return this.isOnCanvas;
    }

    get getHeldButton() {
        return this.heldButton;
    }

    get getPressedButton() {
        // console.log(this.pressedButton);
        const temp = this.pressedButton;
        // this.pressedButton = null;
        return temp;
    }

    get getReleasedButton() {
        const temp = this.releasedButton;
        // this.releasedButton = null;
        return temp;
    }

    get isMousePressed() {
        const temp = this.isPressed;
        // this.isPressed = false;
        return temp;
    }

    get isMouseHeld() {
        return this.isHeld;
    }

    get isMouseReleased() {
        const temp = this.isReleased;
        this.isReleased = false;
        return temp;
    }
 
    public recordPosition(): void {
        this.oldPos = Vec2.copyFrom(this.curPos);
    }

    public getRecordedPosition(): Vec2 {
        return this.oldPos;
    }

    public getCurrentPosition(): Vec2 {
        return this.curPos;
    }

    /**
     * Reset function for the pressed and released button values.
     * Has to be called at the end of each frame
     * 
     * The only reliable way to get the pressed and released button
     * is to reset them at the end of each frame and get new values at
     * the beginning of a new frame. This is a very stupid way of doing
     * this, but it works
     */ 
    public resetMouseController(): void {
        this.pressedButton = null;
        this.releasedButton = null;
    }
}

export { MouseButtons }