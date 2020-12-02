export default interface UserInterface {
    id?: string | number;
    username?: string;
    email: string;
    password: string;
    remember: boolean;
}