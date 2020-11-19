export default interface Project {
    id: string | number;
    name: string;
    dateOfCreation: Date;
    dateOfLastChange: Date;
    files: number;
}