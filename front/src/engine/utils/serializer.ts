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
    public static serialize(object: Serializable): any {
        object.type = object.constructor.name;

        if (object instanceof Group) {
            (object as Group).getShapes.forEach(shape => {
                shape.type = shape.constructor.name;
            });
        }

        return JSON.parse(JSON.stringify(object));
    }

    /**
     * 
     * @param { ShapeObject } obj object for deserialization
     * @returns { Shape | null }  a Shape instance, if deserialization is successful, null otherwise
     */
    public static deserialize(obj: ShapeObject): Shape | null {
        const type = obj.type;
        let shape: Shape;

        switch(type) {
            case "Line": {
                shape = Shape.cloneFromObject<Line>(Line, obj);
                return shape;
            }
            case "Rectangle": {
                shape = Shape.cloneFromObject<Rectangle>(Rectangle, obj);
                return shape;
            }
            case "Circle": {
                shape = Shape.cloneFromObject<Circle>(Circle, obj);
                return shape;
            }
            case "Ellipse": {
                shape = Shape.cloneFromObject<Ellipse>(Ellipse, obj);
                return shape;
            }
            case "Bezier": {
                shape = Shape.cloneFromObject<Bezier>(Bezier, obj);
                return shape;
            }
            case "Arc": {
                shape = Shape.cloneFromObject<Arc>(Arc, obj);
                return shape;
            }
            case "Group": {
                return null;
                break;
            }
            default: return null;
        }
    }
}