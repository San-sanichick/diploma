import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import "../passport/passportHandler";
import { Request, Response } from "express";
import { UserModel, User } from "../db/models/UserModel";
import config from "../config/config";

interface UserInterface {
    email   : string;
    password: string;
}

export default class UserController {
    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const data = JSON.parse(req.body.body);
            const hashedPassword = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
            const user = {
                email: data.email,
                password: hashedPassword
            };
            const {_id: id} = await UserModel.create(user);
            // req.body.scope;
            res.status(200).json({msg: `User ${id} Created`});
        } catch (err) {
            console.error(err);
            res.status(400).json({msg: `User wasn't created`});
        }
    }

    public async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await UserModel.find();
            res.status(200).json({msg: "List of users", data: users});
        } catch (err) {
            console.error(err);
            res.status(400).json({msg: `User wasn't created`});
        }
    }

    public async findUser(req: Request, res: Response): Promise<void> {
        try {
            const found = await UserModel.findOne({ 
                email: req.body.email as string,
                password: req.body.password as string
            });

            if (found !== null) {


                res.status(200).json({msg: "User found", data: {
                    email : found.email,
                    avatar: found.avatar,
                    dateOfSignUp: found.dateOfSignUp
                }});
            } else {
                throw new Error("User not found");
            }

            
        } catch (err) {
            console.error(err);
            res.status(404).json({msg: `User not found`});
        }
    }
}

// interface Result {
//     data? : Object; 
//     msg   : string;
//     status: number;
// }

// export default class UserController {
//     // private _model: User;

//     constructor() {
//         // this._model = new UserModel();
//     }

//     /**
//      * CreateUser
//      * Creates a new user
//      */
//     public async CreateUser(user: UserInterface): Promise<Result> {
//         let result: Result = {msg: "", status: 0};
//         try {
//             const {_id: id} = await UserModel.create(user);
//             result = {msg: `User ${id} Created`, status: 200};
//         } catch (err) {
//             console.error(err);
//             result = {msg: `An error has occured: ${err}`, status: 400};
//         } finally {
//             return result;
//         }
//     }

//     /**
//      * async GetAllUsers
//      */
//     public async GetAllUsers() {
//         let result: Result = {msg: "", status: 0};

//         try {
//             const users = await UserModel.find();
//             result.msg = "List of users";
//             result.status = 200;
//             result.data = users;
//         } catch (err) {
//             console.error(err);
//             result.msg = `An error has occured: ${err}`;
//             result.status = 400;
//         } finally {
//             return result;
//         }
//     }

//     /**
//      * FindUser
//      */
//     public async FindUser(user: UserInterface): Promise<Result> {
//         let result: Result = {msg: "", status: 0};

//         try {
//             // console.log(req.params);
//             const found = await UserModel.findOne({ 
//                 email: user.email as string,
//                 password: user.password as string
//              });
    
//             if (found !== null) {
//                 result = {
//                     data: {
//                         email   : found.email,
//                         password: found.password,
//                         avatar  : found.avatar,
//                         id      : found._id
//                     },
//                     msg: "User found",
//                     status: 200
//                 };
//             } else {
//                 result = {
//                     msg: `User with email ${user.email} not found`,
//                     status: 404
//                 };
//             }
//         } catch (err) {
//             console.error(err);
//             result = {msg: `An error has occured: ${err}`, status: 400};
//         } finally {
//             return result;
//         }
//     }

//     /**
//      * UpdateUser
//      */
//     public async UpdateUser(id: number) {
//         console.log(id);
//     }
// }