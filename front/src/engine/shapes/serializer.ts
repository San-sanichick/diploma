import Arc from "./arc";
import Bezier from "./bezier";
import Circle from "./circle";
import Ellipse from "./ellipse";
import Line from "./line";
import Rectangle from "./rect";
import Serializable from "./serializable";
import Shape, { ShapeObject } from "./shape";

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
    public static serialize(object: Serializable): any {
        object.type = object.constructor.name;
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
            default: return null;
        }
    }
}