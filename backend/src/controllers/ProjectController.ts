import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import passport from "passport";
import { ProjectModel, Project } from "../db/models/ProjectModel";
import { UserModel } from "../db/models/UserModel";

import { getToken } from "../utils/utils";
import config from "../config/config";

import * as fs from "fs";
import path from "path";

export default class ProjectController {
    public async createProject(req: Request, res: Response) {
        const token = getToken(req.headers);

        if (token) {
            const decoded = verify(token, config.ACCESS_TOKEN_SECRET) as any;
            console.log(decoded);

            const data = JSON.parse(req.body.body);
            const project: Project = {
                name: data.name,
                dateOfCreation: new Date(),
                dateOfLastChange: new Date(),
                files: 0,
                publicAccess: data.publicAccess
            };

            try {
                let user = await UserModel.findById(decoded.id).exec();

                if (user !== null && user !== undefined && user.projects !== undefined) {
                    // Well I'll be damned, it actually works
                    const newProject = await ProjectModel.create(project);
                    user.projects.push(newProject);
                    
                    const updUser = await user.save();

                    // create folder
                    const userPath = path.join(__dirname, `../../UserProjects/${updUser._id}`);
                    if (!fs.existsSync(userPath)) {
                        fs.mkdir(userPath, (err)=> {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(`Created new user folder ${updUser._id}`);
                            }
                        });
                    }

                    const p = path.join(__dirname, `../../UserProjects/${updUser._id}/${newProject._id}`)
                    fs.mkdir(p, (err)=> {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`Created new project folder ${newProject._id}`);
                        }
                    });
                    res.status(200).json({msg: `Проект "${newProject.name}" был успешно создан!`, data: newProject});
                }
            } catch (err) {
                res.status(400).json({msg: `Произошла ошибка: ${err}`});
            }
        } else {
            res.status(401).json({msg: "Access denied"});
        }
    }


    public async getAllProjects(req: Request, res: Response) {
        const token = getToken(req.headers);
        console.log("kkkkk");
        if (token) {
            const decoded = verify(token, config.ACCESS_TOKEN_SECRET) as any;
            console.log(decoded);

            try {
                const user = await UserModel.findById(decoded.id);
    
                if (user !== null) {
                    const populated = await user.populate("projects").execPopulate();
                    res.status(200).json({msg: "Успешно получен список проектов", data: populated.projects})
                }
            } catch (err) {
                res.status(400).json({msg: `Произошла ошибка: ${err}`});
            }
        } else {
            res.status(401).json({msg: "Access denied"});
        }
    }


    public async deleteProject(req: Request, res: Response) {
        const token = getToken(req.headers);

        if (token) {
            const decoded = verify(token, config.ACCESS_TOKEN_SECRET) as any;
            console.log(decoded);
            res.status(200).json({msg: `deleted... SIKE`});
        } else {
            res.status(401).json({msg: "Access denied"});
        }
    }
}