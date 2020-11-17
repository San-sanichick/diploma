import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from 'cors';
import {UserModel} from "./db/UserModel";
import usersApi from "./routes/usersApi";
import projectsApi from "./routes/projectsApi";

const app = express();

// CORS
app.use(cors());
app.options('*', cors());  // enable pre-flight

// Body Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

(
    async () => {
        await mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "test" });
    }
)();

app.use("/api/users", usersApi);
app.use("/api/projects", projectsApi);

// app.get("/api/projects", (req: Request, res: Response, next: NextFunction) => {
    // res.status(200).json(projects);
// });

const PORT = process.env.PORT || "3000";

const server = app.listen(PORT, () => {
    console.log(`oh boi i sure am running on port ${PORT}`);
});