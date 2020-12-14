import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/UserController";

export class UserRoutes {
    public router: Router;
    public userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.routes();
    }

    private routes() {
        this.router.get(  "/",       this.userController.getAllUsers);
        this.router.patch("/update", passport.authenticate("jwt", {session: false}), this.userController.updateUser);
        this.router.post( "/login",  this.userController.loginUser);
        this.router.post( "/signUp", this.userController.createUser);
    }
}