import Vector2D from "./vector2d";

export default class MouseController {
    private curPos: Vector2D;
    private oldPos: Vector2D;

    constructor(canvas: HTMLCanvasElement) {
        this.curPos = new Vector2D(0, 0);
        this.oldPos = new Vector2D(0, 0);
        canvas.addEventListener("mousemove", (e) => {
            const boundingRect = canvas.getBoundingClientRect();
            this.curPos.x = e.clientX - boundingRect.x;
            this.curPos.y = e.clientY - boundingRect.y;
        });
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