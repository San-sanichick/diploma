import express, { Application, Request, Response, NextFunction } from "express";
import mongoose          from "mongoose";
import cors              from 'cors';
import dotenv            from "dotenv";
import { UserRoutes }    from "./routes/UserRoutes";
import { ProjectRoutes } from "./routes/ProjectRoutes";
import { TokenRoutes }   from "./routes/TokenRoutes";
import config            from "./config/config";

class App {
    private static _instance: App;
    private _app            : Application;
    private readonly _port  : number | string;

    
    private constructor(port: number | string = config.port) {
        dotenv.config();
        this._app  = express();
        this._port = port;

        this._app.use(cors({
            origin: config.frontOrigin
        }));

        this._app.disable('x-powered-by');
        
        this.setMiddlewares();

        this.setRoutes();

        this._app.use(this.logErrors);
        this._app.use(this.errorHandler);
    }

    public static get Instance(): App {
        return this._instance || (this._instance = new this());
    }

    public async init() {
        await this.connectToDB();
        this._app.listen(this._port, () => console.log(`Server is running on port ${this._port}`));
    }

    private setRoutes() {
        this._app.use("/api/users",         new UserRoutes().router);
        this._app.use("/api/projects",      new ProjectRoutes().router);
        this._app.use("/api/token/refresh", new TokenRoutes().router);

        this._app.get("/", (req, res) => {
            res.send("kek");
        })
    }

    private setMiddlewares() {
        this._app.use(express.json());
        this._app.use(express.urlencoded({extended: false}));
    }

    private async connectToDB() {
        await mongoose.connect(config.db.address, { useNewUrlParser: true, useUnifiedTopology: true, dbName: config.db.name });
        console.log("connected to db");
    }

    private logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
        console.error(err.stack);
        next(err);
    }

    private errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
        res.status(500);
        res.send({error: err});
    }
}

const app = App.Instance;
app.init();
