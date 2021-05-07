export default interface Project {
    _id: string | number;
    name: string;
    dateOfCreation: Date;
    dateOfLastChange: Date;
    thumbnail: string;
    files: number;
}

export interface IProject {
    offset: Object;
    scale: number;
    shapes: Array<Object>;
}