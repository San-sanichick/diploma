import { Router } from "express";
import { Project, ProjectModel } from "../db/ProjectModel";
import { UserModel } from "../db/UserModel";

const projectsApi = Router();

// Create project
projectsApi.post("/:id", async (req, res) => {
    try {
        const data = JSON.parse(req.body.body);

        const project: Project = {
            name: data.name,
            dateOfCreation: new Date(),
            dateOfLastChange: new Date(),
            files: 0,
            publicAccess: data.publicAccess
        };

        let user = await UserModel.findById(req.params.id).exec();
        if (user !== null && user !== undefined && user.projects !== undefined) {
            user.projects.push(new ProjectModel(project));

            const updUser = await user.save();

            res.status(200).json({
                msg: "Project added!",
                project,
                updUser
            });
        }

        console.log(project);
    } catch (err) {
        console.error(err);
        res.status(400).json({msg: `An error has occured: ${err}`});
    }
});

projectsApi.get("/:id", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (user !== null && user !== undefined) {
            const project = user.projects;
            res.status(200).json(project);
        } else {
            res.status(404).json({msg: "User not found"});
        }
        
    } catch (err) {
        console.error(err);
    }
});

export default projectsApi