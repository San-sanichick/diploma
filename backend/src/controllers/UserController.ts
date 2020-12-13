import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import "../passport/passportHandler";

import * as fs from "fs";
import path from "path";

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
            const data = req.body;

            const hashedPassword = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
            
            console.log(hashedPassword);
            const user = {
                email: data.email,
                username: data.email,
                password: hashedPassword
            };
            const newUser = await UserModel.create(user);

            const p = path.join(__dirname, `../../UserProjects/${newUser._id}/`)
            fs.mkdir(p, (err)=> {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Created new user folder ${newUser._id}`);
                }
            });

            res.status(200).json({msg: `User ${newUser._id} Created`});
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

    public async loginUser(req: Request, res: Response): Promise<void> {
        const
            email    = req.body.email,
            password = req.body.password,
            remember = req.body.remember;

        // req.is

        try {
            const found = await UserModel.findOne({ 
                email: email
            });
            
            if (found !== null) {
                const isMatch = await bcrypt.compare(password, found.password as string);
                
                if (isMatch) {
                    const payload = {
                        id      : found._id,
                        username: found.username || found.email
                    }
                    
                    const token = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {expiresIn: config.ACCESS_TOKEN_LIFE});

                    if (remember) {
                        const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {expiresIn: config.REFRESH_TOKEN_LIFE});

                        res.status(200).json({
                            msg : "Successfully found user",
                            data: {
                                token       : "Bearer " + token,
                                refreshToken: "JWT " + refreshToken,
                                user        : found
                            }
                        });
                    } else {
                        res.status(200).json({
                            msg : "Successfully found user",
                            data: {
                                token: "Bearer " + token,
                                user : found
                            }
                        });
                    }
                } else {
                    res.status(400).json({
                        msg: "Incorrect password"
                    })
                } 
            } else {
                throw new Error("User not found");
            }

            // if (found !== null) {
            //     res.status(200).json({msg: "Пользователь найден", data: {
            //         id: found._id,
            //         email : found.email,
            //         username: found.username,
            //         avatar: found.avatar,
            //         dateOfSignUp: found.dateOfSignUp
            //     }});
            // } else {
            //     throw new Error("Логин или пароль не верны");
            // }
        } catch (err) {
            console.error(err);
            res.status(404).json({msg: `Логин или пароль не верны`});
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