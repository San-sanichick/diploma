import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from 'cors';
import usersApi from "./routes/usersApi";
import projectsApi from "./routes/projectsApi";
import config from "./config/config";

// class App {
//     private static _instance: App;
//     private _app: Application;
//     private readonly _port: number | string;

//     private constructor(port: number | string = process.env.PORT || "3000") {
//         this._app = express();
//         this._port = port;

//         this._app.use(cors);
//         this._app.options('*', cors());  // enable pre-flight
        
//         this.setMiddlewares();

//         this.setRoutes();

//         this.connectToDB();

//         this._app.use(this.logErrors);
//         this._app.use(this.errorHandler);
//     }

//     public static get Instance(): App {
//         return this._instance || (this._instance = new this());
//     }

//     public init() {
//         this._app.listen(this._port, () => console.log(`Boy I sure am listenning on port ${this._port}`));
//     }

//     private setRoutes() {
//         this._app.use("/api/users", usersApi);
//         this._app.use("/api/projects", projectsApi);

//         this._app.get("/", (req, res) => {
//             res.send("kek");
//         })
//     }

//     private setMiddlewares() {
//         this._app.use(express.json());
//         this._app.use(express.urlencoded({extended: false}));
//     }

//     private connectToDB() {
//         (
//             async () => {
//                 await mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "test" });
//                 console.log("connected to db");
//             }
//         )();
//     }

//     private logErrors(err: Error, req: Request, res: Response, next: NextFunction) {
//         console.error(err.stack);
//         next(err);
//     }

//     private errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
//         res.status(500);
//         res.send({error: err});
//     }
// }

// const app = App.Instance;
// app.init();

const app = express();

// CORS
app.use(cors());
app.options('*', cors());  // enable pre-flight

// Body Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect(config.db.address, { useNewUrlParser: true, useUnifiedTopology: true, dbName: config.db.name});


// Routes
app.use("/api/users", usersApi);
app.use("/api/projects", projectsApi);

const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
    console.log(`oh boi i sure am running on port ${PORT}`);
});