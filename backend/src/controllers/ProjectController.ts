import { Request, Response } from "express";
import { ProjectModel, Project } from "../db/models/ProjectModel";
import { UserModel } from "../db/models/UserModel";

export default class ProjectController {
    public async createProject(req: Request, res: Response) {
        const data = JSON.parse(req.body.body);
        const project: Project = {
            name: data.name,
            dateOfCreation: new Date(),
            dateOfLastChange: new Date(),
            files: 0,
            publicAccess: data.publicAccess
        };

        try {
            let user = await UserModel.findById(req.params.id).exec();

            if (user !== null && user !== undefined && user.projects !== undefined) {
                // Well I'll be damned, it actually works
                const newProject = await ProjectModel.create(project);
                user.projects.push(newProject);
                
                const updUser = await user.save();
    
                res.status(200).json({msg: `Project ${newProject.name} created successfully!`, data: newProject});
            }
        } catch (err) {
            res.status(400).json({msg: `An error has occured: ${err}`});
        }
    }

    public async getAllProjects(req: Request, res: Response) {
        try {
            const user = await UserModel.findById(req.params.id);
    
            if (user !== null) {
                const populated = await user.populate("projects").execPopulate();
                res.status(200).json({msg: "Successfully retrieved list of projects", data: populated.projects})
            }
        } catch (err) {
            res.status(400).json({msg: `An error has occured: ${err}`});
        }
    }

    public async deleteProject(req: Request, res: Response) {
        
    }
}