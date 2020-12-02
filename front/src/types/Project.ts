export default interface Project {
    _id: string | number;
    name: string;
    dateOfCreation: Date;
    dateOfLastChange: Date;
    files: number;
}