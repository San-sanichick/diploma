import express, { Application, Request, Response, NextFunction } from "express";
import cors from 'cors';
import usersApi from "./routes/usersApi";

import projects from "./dummyData/projects";

const app = express();

// CORS
app.use(cors());
app.options('*', cors());  // enable pre-flight
// Body Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// connect("monfodb://localhost:27017/test");

app.use("/api/users", usersApi);

app.get("/api/projects", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(projects);
});

const PORT = process.env.PORT || "3000";

const server = app.listen(PORT, () => {
    console.log(`oh boi i sure am running on port ${PORT}`);
});