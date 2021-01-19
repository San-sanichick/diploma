import bcrypt   from "bcrypt";
import * as jwt from "jsonwebtoken";
import "../passport/passportHandler";

import * as fs from "fs";
import path    from "path";

import { Request, Response } from "express";
import { UserModel, User }   from "../db/models/UserModel";
import config                from "../config/config";
import { getToken }          from "../utils/utils";

export default class UserController {
    /**
     * Create user function, makes a call to model to create a new user,
     * if successful, sends new User as JSON to client, else sends error message
     * @param req express request object
     * @param res express response object
     */
    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;

            const hashedPassword = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
            
            console.log(hashedPassword);
            const user = {
                email   : data.email,
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

    /**
     * Update user function, makes a call to User model and updates the corespnding user if found
     * and sends the updated user to client if successful, else sends error message
     * @param req express request object
     * @param res express response object
     */
    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const token = getToken(req.headers);

            if (token) {
                const 
                    decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET) as any,
                    data    = req.body;

                const user = await UserModel.findById(decoded.id);

                console.log(user);
                if (user) {

                    user.username = data.username;
                    user.email    = data.email;
                    user.save();

                    const payload = {
                        id      : user._id,
                        username: user.username || user.email
                    }
                    
                    const token = jwt.sign(payload, config.ACCESS_TOKEN_SECRET, {expiresIn: config.ACCESS_TOKEN_LIFE});
                    
                    res.status(200).json({
                        msg : "Настройки пользователя сохранены",
                        data: {
                            token: "Bearer " + token,
                            user
                        }
                    });
                } else {
                    throw new Error("Ошибка при обновлении настроек пользователя");
                }
            } else {
                res.status(401).json({msg: "Unathorized"});
            }
        } catch (err) {
            console.error(err);
            res.status(400).json({msg: err});
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
                    throw new Error("Неверный пароль");
                } 
            } else {
                throw new Error("Пользователь не найден");
            }
        } catch (err) {
            console.error(err);
            res.status(400).json({msg: err});
        }
    }
}
