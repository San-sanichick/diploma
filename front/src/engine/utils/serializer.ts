import SetToJSON from "./setToJSON";
import Arc from "../shapes/arc";
import Bezier from "../shapes/bezier";
import Circle from "../shapes/circle";
import Ellipse from "../shapes/ellipse";
import Group from "../shapes/group";
import Line from "../shapes/line";
import Rectangle from "../shapes/rect";
import Serializable from "../shapes/serializable";
import Shape, { ShapeObject } from "../shapes/shape";
import Drawable from "../shapes/drawable";
import Polygon from "../shapes/polygon";
import Polyline from "../shapes/polyline";
import Spline from "../shapes/spline";

/**
 * This is the dumbest class, because it only works with shapes,
 * so it's not universal. ffs
 */
export default class Serializer {

    /**
     * Serializes a serializable array of objects into a regular array of objects with no type.
     * @param { Serializable } object array of Serializable objects
     * @returns { any } serialized array
     */
    // eslint-disable-next-line
    public static serialize(array: Serializable[]): any[] {
        for (const obj of array) {
            obj.type = obj.constructor.name;

            if (obj instanceof Group) {
                Serializer.serialize((obj as Group).getObjects);
            }
        }

        return JSON.parse(JSON.stringify(array));
    }

    /**
     * Absolute unit of a method, you have not ever seen a method more stupid than this
     * 
     * This may return an empty array (theoretically, dunno, haven't tested it), 
     * if you pass it garbage data
     * @param { ShapeObject } obj object for deserialization
     * @returns { Array<Drawable> } an array of Drawable if deserialization is successful
     */
    public static deserialize(array: any[]): Array<Drawable> {
        const arr = new Array<Drawable>();
        for (const obj of array) {
            const type = obj.type;

            switch(type) {
                case "Line": {
                    arr.push(Shape.cloneFromObject<Line>(Line, obj as ShapeObject));
                    break;
                }
                case "Rectangle": {
                    arr.push(Shape.cloneFromObject<Rectangle>(Rectangle, obj as ShapeObject));
                    break;
                }
                case "Circle": {
                    arr.push(Shape.cloneFromObject<Circle>(Circle, obj as ShapeObject));
                    break;
                }
                case "Ellipse": {
                    arr.push(Shape.cloneFromObject<Ellipse>(Ellipse, obj as ShapeObject));
                    break;
                }
                case "Bezier": {
                    arr.push(Shape.cloneFromObject<Bezier>(Bezier, obj as ShapeObject));
                    break;
                }
                case "Arc": {
                    arr.push(Shape.cloneFromObject<Arc>(Arc, obj as ShapeObject));
                    break;
                }
                case "Group": {
                    arr.push(new Group(obj.name, Serializer.deserialize(obj.objects)));
                    break;
                }
                case "Polygon": {
                    arr.push(Shape.cloneFromObject<Polygon>(Polygon, obj as ShapeObject));
                    break;
                }
                case "Polyline": {
                    arr.push(Shape.cloneFromObject<Polyline>(Polyline, obj as ShapeObject));
                    break;
                }
                case "Spline": {
                    arr.push(Shape.cloneFromObject<Spline>(Spline, obj as ShapeObject));
                    break;
                }
                default: {
                    break;
                }
            }
        }
        return arr;
    }
}