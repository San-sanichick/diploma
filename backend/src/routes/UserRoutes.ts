import { Router }     from "express";
import { body } from "express-validator";
import passport       from "passport";
import UserController from "../controllers/UserController";
import { UserModel } from "../db/models/UserModel";

export class UserRoutes {
    public router        : Router;
    public userController: UserController;

    constructor() {
        this.router         = Router();
        this.userController = new UserController();
        this.routes();
    }

    private async isValidUser(email: string) {
        const user = await UserModel.findOne({ email });
        if (user) {
            return Promise.reject("Email занят");
        }
    }

    private routes() {
        this.router.get(  "/",       this.userController.getAllUsers);
        this.router.patch("/update", passport.authenticate("jwt", {session: false}), this.userController.updateUser);
        this.router.post( "/login",  body("email").isEmail().normalizeEmail(), this.userController.loginUser);
        this.router.post( "/signUp", body("email").custom(this.isValidUser), this.userController.createUser);
    }
}