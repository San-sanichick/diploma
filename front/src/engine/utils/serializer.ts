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
        console.log(array);
        console.log("Type:", Line.constructor.name);
        for (const obj of array) {
            const type = obj.type;

            switch(type) {
                case new Line().constructor.name: {
                    arr.push(Shape.cloneFromObject<Line>(Line, obj as ShapeObject));
                    break;
                }
                case new Rectangle().constructor.name: {
                    arr.push(Shape.cloneFromObject<Rectangle>(Rectangle, obj as ShapeObject));
                    break;
                }
                case new Circle().constructor.name: {
                    arr.push(Shape.cloneFromObject<Circle>(Circle, obj as ShapeObject));
                    break;
                }
                case new Ellipse().constructor.name: {
                    arr.push(Shape.cloneFromObject<Ellipse>(Ellipse, obj as ShapeObject));
                    break;
                }
                case new Bezier().constructor.name: {
                    arr.push(Shape.cloneFromObject<Bezier>(Bezier, obj as ShapeObject));
                    break;
                }
                case new Arc().constructor.name: {
                    arr.push(Shape.cloneFromObject<Arc>(Arc, obj as ShapeObject));
                    break;
                }
                case new Group("", []).constructor.name: {
                    arr.push(new Group(obj.name, Serializer.deserialize(obj.objects)));
                    break;
                }
                case new Polygon().constructor.name: {
                    arr.push(Shape.cloneFromObject<Polygon>(Polygon, obj as ShapeObject));
                    break;
                }
                case new Polyline().constructor.name: {
                    arr.push(Shape.cloneFromObject<Polyline>(Polyline, obj as ShapeObject));
                    break;
                }
                case new Spline().constructor.name: {
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