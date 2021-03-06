import { Router }        from "express";
import passport          from "passport";
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
        this.router.post(  "/create",             passport.authenticate("jwt", {session: false}), this.projectController.createProject);
        this.router.get(   "/get_all",            passport.authenticate("jwt", {session: false}), this.projectController.getAllProjects);
        this.router.get(   "/get/:id",            passport.authenticate("jwt", {session: false}), this.projectController.getProjectByID);
        this.router.get(   "/get_by_name/:query", passport.authenticate("jwt", {session: false}), this.projectController.getProjectsByName);
        this.router.patch( "/update",             passport.authenticate("jwt", {session: false}), this.projectController.updateProjectConfig);
        this.router.patch( "/save",               passport.authenticate("jwt", {session: false}), this.projectController.updateProject);
        this.router.delete("/delete/:id",         passport.authenticate("jwt", {session: false}), this.projectController.deleteProject);
    }
}