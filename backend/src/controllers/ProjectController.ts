import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import passport from "passport";

import IProject from "../db/interfaces/ProjectInterface";
import { ProjectModel, Project } from "../db/models/ProjectModel";
import { UserModel } from "../db/models/UserModel";

import { decodeBase64Image, getToken } from "../utils/utils";
import config from "../config/config";

import * as fs from "fs";
import path from "path";
import del from "del";
import { promisify } from "util";
import { isDocumentArray } from "@typegoose/typegoose";


const writeFile = promisify(fs.writeFile);
const readFile  = promisify(fs.readFile);
const mkdir     = promisify(fs.mkdir);

export default class ProjectController {
    public async createProject(req: Request, res: Response) {
        const token = getToken(req.headers);
        if (token) {
            const decoded = verify(token, config.ACCESS_TOKEN_SECRET) as any;

            const data = req.body;
            // console.log(data);
            const project: Project = {
                name: data.name,
                dateOfCreation: new Date(),
                dateOfLastChange: new Date(),
                files: 0,
                thumbnail: "",
                publicAccess: data.publicAccess
            };

            try {
                let user = await UserModel.findById(decoded.id).exec();

                if (user !== null && user !== undefined && user.projects !== undefined) {
                    // Well I'll be damned, it actually works
                    const newProject = await ProjectModel.create(project);
                    user.projects.push(newProject);
                    
                    const updUser = await user.save();

                    const projectPath = path.join(__dirname, `../../UserProjects/${updUser._id}/${newProject._id}`);
                    const imagePath = path.join(__dirname, `../../public/${updUser._id}/${newProject._id}/`);
                    try {
                        await mkdir(projectPath, {recursive: true});
                        await mkdir(imagePath, {recursive: true});
                        
                        console.log(`Created new project folder ${newProject._id}`);
                    } catch (err) {
                        // console.error(err);
                        throw err;
                    }

                    const newProjectFile: IProject = {
                        offset: { x: 0, y: 0 },
                        scale: 10,
                        layers: []
                    }

                    fs.writeFileSync(`${projectPath}/save.json`, JSON.stringify(newProjectFile));
                    res.status(200).json({msg: `Проект "${newProject.name}" был успешно создан!`, data: newProject});
                }
            } catch (err) {
                res.status(400).json({msg: `Произошла ошибка: ${err}`});
            }
        } else {
            res.status(401).json({msg: "Access denied"});
        }
    }

    public async updateProject(req: Request, res: Response) {
        const token = getToken(req.headers);
        // console.log(req.body);  
        if (token) {
            const decoded = verify(token, config.ACCESS_TOKEN_SECRET) as any;

            try {
                const user = await UserModel.findById(decoded.id);
                
                if (user) {
                    const project = await ProjectModel.findById(req.body.id);
                         
                    if (project) {
                        const projectPath = path.join(__dirname, `../../UserProjects/${user._id}/${project._id}/`);
                        const imagePath = path.join(__dirname, `../../public/${user._id}/${project._id}/`);
                        const img = req.body.data.image as string;
                        delete req.body.data.image;
                        const imgData = decodeBase64Image(img);
                        // const buf = Buffer.from(data, "base64");
                        try {

                            if (!fs.existsSync(imagePath)) {
                                await mkdir(imagePath, {recursive: true});
                            }
                                

                            await writeFile(projectPath + "save.json", JSON.stringify(req.body.data));
                            await writeFile(imagePath + "thumb.jpg", imgData.data);

                            project.dateOfLastChange = new Date();
                            project.thumbnail = `${user._id}/${project._id}/thumb.jpg`;
                            project.save();

                            res.status(200).json({
                                msg: `Проект ${project.name} успешно сохранён`
                            });
                        } catch (err) {
                            throw err;
                        }                        
                    }
                }

            } catch (err) {
                res.status(400).json({msg: `Произошла ошибка: ${err}`});
            }
        } else {
            res.status(401).json({msg: "Access denied"});
        }
    }

    public async updateProjectConfig(req: Request, res: Response) {
        const token = getToken(req.headers);
        if (token) {
            const decoded = verify(token, config.ACCESS_TOKEN_SECRET) as any;

            try {
                const user = await UserModel.findById(decoded.id);
                
                if (user) {
                    const project = await ProjectModel.findById(req.body.id);
                         
                    if (project) {
                        project.name = req.body.name;
                        project.publicAccess = req.body.access;
                        project.dateOfLastChange = new Date();
                        project.save();
                        res.status(200).json({
                            msg: `Настройки проекта ${project.name} успешно обновлены`,
                            data: project
                        });
                    }
                }

            } catch (err) {
                res.status(400).json({msg: `Произошла ошибка: ${err}`});
            }
        } else {
            res.status(401).json({msg: "Access denied"});
        }
    }
    
    public async getProjectsByName(req: Request, res: Response) {
        const token = getToken(req.headers);

        if (token) {
            const decoded = verify(token, config.ACCESS_TOKEN_SECRET) as any;

            try {
                const user = await UserModel.findById(decoded.id);

                if (user) {
                    const populated = await user.populate("projects").execPopulate();
                    const projects = populated.projects;
                    const query = req.params.query as string;

                    // console.log(query);

                    if (projects) {
                        if (isDocumentArray(projects)) {
                            const projectsFiltered = projects.filter(pr => pr.name?.toLowerCase().includes(query.toLowerCase()));

                            res.status(200).json({
                                msg: "Результат поиска",
                                data: projectsFiltered
                            });
                        }
                    }
                }
            } catch (err: any) {
                console.error(err);
                res.status(400).json({msg: `Произошла ошибка: ${err.message}`});
            }
        }
    }

    public async getProjectByID(req: Request, res: Response) {
        const token = getToken(req.headers);
        // console.log(req.body);
        if (token) {
            const decoded = verify(token, config.ACCESS_TOKEN_SECRET) as any;

            try {
                const user = await UserModel.findById(decoded.id);
                // console.log(user);
                
                if (user) {
                    const project = await ProjectModel.findById(req.params.id);

                    if (project) {
                        const userPath = path.join(__dirname, `../../UserProjects/${user._id}/${project._id}`);
                        try {
                            const projectData = await readFile(`${userPath}/save.json`);
                            const save = JSON.parse(projectData as unknown as string);

                            res.status(200).json({
                                msg: `Проект ${project.name} успешно загружен`,
                                data: save
                            })
                        } catch (err) {
                            throw err;
                        }
                    }
                }

            } catch (err: any) {
                res.status(400).json({msg: `Произошла ошибка: ${err.message}`});
            }
        } else {
            res.status(401).json({msg: "Нет доступа"});
        }
    }

    public async getAllProjects(req: Request, res: Response) {
        // console.log(req.headers);
        try {
            const token = getToken(req.headers);
            if (token) {
                const decoded = verify(token, config.ACCESS_TOKEN_SECRET) as any;

                const user = await UserModel.findById(decoded.id);
    
                if (user !== null) {
                    const populated = await user.populate("projects").execPopulate();
                    res.status(200).json({msg: "Успешно получен список проектов", data: populated.projects});
                } else {
                    throw new Error("пользователь не найден");
                }
            }
        } catch (err: any) {
            res.status(400).json({msg: `Произошла ошибка: ${err.message}`});
        }
    }

    public async deleteProject(req: Request, res: Response) {
        try {
            const token = getToken(req.headers);

            if (token) {
                const decoded = verify(token, config.ACCESS_TOKEN_SECRET) as any;
                const project = await ProjectModel.findByIdAndDelete(req.params.id);

                if (project !== null) {
                    const user = await UserModel.findByIdAndUpdate(
                        decoded.id, 
                        {
                            "$pull": { "projects": project._id }
                        }, 
                        {
                            useFindAndModify: false
                        },
                        (err, res) => {
                            if (err) throw new Error(err);
                        }
                    )
                    if (user !== null) {
                        const populated = await user.populate("projects").execPopulate();

                        try {
                            // we need to remove the project folder when we're done
                            const dir = await del( [ `UserProjects/${user._id}/${project._id}` ] );
                            const imgDir = await del( [ `public/${user._id}/${project._id}` ] );
                            // console.log(dir);

                            res.status(200).json({msg: `Проект ${project!.name} был успешно удалён`, data: populated.projects});
                        } catch (err: any) {
                            // res.status(400).json({msg: "Ошибка при удалении проекта"});
                            throw new Error(err);
                        }
                    }
                }
            } else  {
                throw new Error("Нет доступа");
            }
        } catch (err: any) {
            res.status(400).json({msg: `Произошла ошибка: ${err.message}`});
        }
    }
}