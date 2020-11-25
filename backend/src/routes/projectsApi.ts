import { Router } from "express";
import { Project, ProjectModel } from "../db/models/ProjectModel";
import { UserModel } from "../db/models/UserModel";

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
            // Well I'll be damned, it actually works
            user.projects.push(await ProjectModel.create(project));

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

        if (user !== null) {
            const populated = await user.populate("projects").execPopulate();
            res.status(200).json(populated.projects);
        }
    } catch (err) {
        console.error(err);
    }
});

export default projectsApi