import { Router }      from "express";
import TokenController from "../controllers/TokenController";

export class TokenRoutes {
    public router: Router;
    public tokenController: TokenController;

    constructor() {
        this.router = Router();
        this.tokenController = new TokenController();
        this.routes();
    }

    private routes() {
        this.router.post("/", this.tokenController.genToken);
    }
}