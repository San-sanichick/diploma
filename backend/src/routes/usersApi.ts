import { Router } from "express";
import { UserModel } from "../db/UserModel";

const usersApi = Router();

// Create user
usersApi.post("/", async (req, res) => {
    try {
        const user = {
            email: req.body.email,
            password: req.body.password
        };
    
        const {_id: id} = await UserModel.create(user);
        res.status(200).json({msh: `User ${id} Created`});
    } catch (err) {
        console.error(err);
        res.status(400).json({msg: `An error has occured: ${err}`});
    }
});

// Read users
usersApi.get("/", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(400).json({msg: `An error has occured: ${err}`});
    }
});

// Read specific user
usersApi.get("/:email", async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.params.email});

        if (user !== null) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                msg: "User not found"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({msg: `An error has occured: ${err}`});
    }
});

// Update user
usersApi.put("/:id", (req, res) => {
    res.status(200);
});

export default usersApi