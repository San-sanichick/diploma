/**
 * Base serializable class, adds a "type" field to class
 * objects for proper serialzation
 */
export default abstract class Serializable {
    public type: string | undefined = "";

    public Serializable() {
        this.type = this.constructor.name;
    }
}