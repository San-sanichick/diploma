/**
 * Base serializable interface, adds a "type" field to class
 * objects for proper serialzation
 */
export default interface Serializable {
    type: string | undefined;
}