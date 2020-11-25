import { Router } from "express";
import UserController from "../controllers/UserController";

const usersApi = Router();
const userController = new UserController();

// Create user
usersApi.post("/", async (req, res) => {
    const data = JSON.parse(req.body.body);
    const user = {
        email: data.email,
        password: data.password
    };
    const result = await userController.CreateUser(user);
    res.status(result.status).json(result.msg);
});

// Read users
usersApi.get("/", async (req, res) => {
    console.log("ahahah");
    const result = await userController.GetAllUsers();
    res.status(result.status).json({msg: result.msg, data: result.data});
});

// Read specific user
usersApi.get("/login", async (req, res) => {
    const query = { 
        email: req.query.email as string,
        password: req.query.password as string
    }
    const result = await userController.FindUser(query);
    res.status(result.status).json({msg: result.msg, data: result.data});
});

// Update user
usersApi.put("/:id", (req, res) => {
    res.status(200);
});

export default usersApi