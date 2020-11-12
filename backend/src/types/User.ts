import Project from "./Project";

export default interface UserInterface {
    id?: string | number;
    email: string;
    password: string;
    remember: boolean;
    projects: Project[];
}