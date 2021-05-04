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

/**
 * This is the dumbest class, because it only works with shapes,
 * so it's not universal. ffs
 */
export default class Serializer {

    /**
     * Serializes a serializable object into a regular object with no type.
     * @param { Serializable } object Serializable object
     * @returns { any } serialized object
     */
    // eslint-disable-next-line
    public static serialize(array: Serializable[]): any[] {
        // object.type = object.constructor.name;

        // if (object instanceof Group) {
        //     (object as Group).getObjects.forEach(shape => {
        //         shape.type = shape.constructor.name;
        //     });
        // }

        // return JSON.parse(JSON.stringify(object));

        for (const obj of array) {
            obj.type = obj.constructor.name;

            if (obj instanceof Group) {
                Serializer.serialize((obj as Group).getObjects);
            }
        }

        return JSON.parse(JSON.stringify(array));
    }

    /**
     * 
     * @param { ShapeObject } obj object for deserialization
     * @returns { Shape | null }  a Shape instance, if deserialization is successful, null otherwise
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
                default: {
                    break;
                }
            }
        }
        return arr;
    }
}