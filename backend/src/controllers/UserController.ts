import { UserModel, User } from "../db/models/UserModel";
interface UserInterface {
    email   : string;
    password: string;
}

interface Result {
    data? : Object; 
    msg   : string;
    status: number;
}

export default class UserController {
    // private _model: User;

    constructor() {
        // this._model = new UserModel();
    }

    /**
     * CreateUser
     * Creates a new user
     */
    public async CreateUser(user: UserInterface): Promise<Result> {
        let result: Result = {msg: "", status: 0};
        try {
            const {_id: id} = await UserModel.create(user);
            result = {msg: `User ${id} Created`, status: 200};
        } catch (err) {
            console.error(err);
            result = {msg: `An error has occured: ${err}`, status: 400};
        } finally {
            return result;
        }
    }

    /**
     * async GetAllUsers
     */
    public async GetAllUsers() {
        let result: Result = {msg: "", status: 0};

        try {
            const users = await UserModel.find();
            result.msg = "List of users";
            result.status = 200;
            result.data = users;
        } catch (err) {
            console.error(err);
            result.msg = `An error has occured: ${err}`;
            result.status = 400;
        } finally {
            return result;
        }
    }

    /**
     * FindUser
     */
    public async FindUser(user: UserInterface): Promise<Result> {
        let result: Result = {msg: "", status: 0};

        try {
            // console.log(req.params);
            const found = await UserModel.findOne({ 
                email: user.email as string,
                password: user.password as string
             });
    
            if (found !== null) {
                result = {
                    data: {
                        email   : found.email,
                        password: found.password,
                        avatar  : found.avatar,
                        id      : found._id
                    },
                    msg: "User found",
                    status: 200
                };
            } else {
                result = {
                    msg: "User not found",
                    status: 404
                };
            }
        } catch (err) {
            console.error(err);
            result = {msg: `An error has occured: ${err}`, status: 400};
        } finally {
            return result;
        }
    }

    /**
     * UpdateUser
     */
    public async UpdateUser(id: number) {
        console.log(id);
    }
}