import Drawable from "../shapes/drawable";

export default interface Layer {
    id: number;
    name: string;
    layerColor: number;
    shapes: Array<Drawable>;
}