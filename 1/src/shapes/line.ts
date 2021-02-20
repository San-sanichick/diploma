import Shape from "./shape";
import Vector2D from "../utils/vector2d";

export default class Line extends Shape {
    constructor() {
        super(2);
    }

    // this'll need to move all the points by some delta
    translate(deltaDist: Vector2D): void {
        
    }

    // this'll need to calculate new positions of nodes based on angle
    rotate(angle: number): void {

    }

    // this'll need to calculate new positions of nodes based on size coefficient
    resize(sizeCoeff: number):void {
    
    }

    renderSelf(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "none";
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.nodes[0].getPosition.x, this.nodes[0].getPosition.y);
        ctx.lineTo(this.nodes[1].getPosition.x, this.nodes[1].getPosition.y);
        ctx.stroke();
    }
}