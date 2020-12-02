import { Router } from "express";
import ProjectController from "../controllers/ProjectController";

export class ProjectRoutes {
    public router: Router;
    public projectController: ProjectController;

    constructor() {
        this.router = Router();
        this.projectController = new ProjectController();
        this.routes();
    }

    private routes() {
        this.router.get("/:id", this.projectController.getAllProjects);
        this.router.post("/:id", this.projectController.createProject);
        this.router.delete("/:id", this.projectController.deleteProject);
    }
}