import Vector2D from "./vector2d";
import { clamp } from "./math";

enum MouseButtons {
    LEFT,
    MIDDLE,
    RIGHT
}

export default class MouseController {
    private curPos: Vector2D;
    private oldPos: Vector2D;

    private delta      = 0;
    private oldDelta   = 0;

    private mouseWheelStep = 20;

    private isPressed  = false;
    private isHeld     = false;
    private isReleased = false;
    private heldButton: number | null     = null;
    private releasedButton: number | null = null;
    private pressedButton: number | null  = null;

    constructor(canvas: HTMLCanvasElement) {
        this.curPos = new Vector2D(0, 0);
        this.oldPos = new Vector2D(0, 0);
        canvas.addEventListener("mousemove", (e) => {
            const boundingRect = canvas.getBoundingClientRect();
            this.curPos.x = e.clientX - boundingRect.x;
            this.curPos.y = e.clientY - boundingRect.y;
        });

        canvas.addEventListener("wheel", (e) => {
            this.oldDelta = this.delta;
            if (e.deltaY > 0) {
                this.delta += this.mouseWheelStep
            } else if (e.deltaY < 0) {
                this.delta -= this.mouseWheelStep;
            }
        });

        canvas.addEventListener("mousedown", (e) => {
            this.heldButton = e.button;
            this.pressedButton = e.button;
            this.isPressed = true;

            // it just works
            setTimeout(() => {
                this.pressedButton = null;
                this.isPressed = false;
            }, 0);

            this.releasedButton = null;
            this.isHeld = true;
        });

        canvas.addEventListener("mouseup", (e) => {
            this.releasedButton = e.button;
            this.heldButton = null;
            this.isHeld = false;
            this.isReleased = true;
        });
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

    get getHeldButton() {
        return this.heldButton;
    }

    get getPressedButton() {
        // console.log(this.pressedButton);
        const temp = this.pressedButton;
        //this.pressedButton = null;
        return temp;
    }

    get getReleasedButton() {
        const temp = this.releasedButton;
        this.releasedButton = null;
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
        this.oldPos = Vector2D.copyFrom(this.curPos);
    }

    public getRecordedPosition(): Vector2D {
        return this.oldPos;
    }

    public getCurrentPosition(): Vector2D {
        return this.curPos;
    }
}

export { MouseButtons }