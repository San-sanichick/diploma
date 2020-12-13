import { Router } from "express";
import passport from "passport";
import ProjectController from "../controllers/ProjectController";
import "../passport/passportHandler";

export class ProjectRoutes {
    public router: Router;
    public projectController: ProjectController;

    constructor() {
        this.router = Router();
        this.projectController = new ProjectController();
        this.routes();
    }

    private routes() {
        this.router.get(   "/",    passport.authenticate("jwt", {session: false}), this.projectController.getAllProjects);
        this.router.post(  "/",    passport.authenticate("jwt", {session: false}), this.projectController.createProject);
        this.router.delete("/:id", passport.authenticate("jwt", {session: false}), this.projectController.deleteProject);
    }
}