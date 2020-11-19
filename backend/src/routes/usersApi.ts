import { Router } from "express";
import { UserModel } from "../db/UserModel";

const usersApi = Router();

// Create user
usersApi.post("/", async (req, res) => {
    try {
        const data = JSON.parse(req.body.body);
        const user = {
            email: data.email,
            password: data.password
        };
    
        const {_id: id} = await UserModel.create(user);
        res.status(200).json({msg: `User ${id} Created`});
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
usersApi.get("/login", async (req, res) => {
    try {
        // console.log(req.params);
        const user = await UserModel.findOne({ 
            email: req.query.email as string,
            password: req.query.password as string
         });

        if (user !== null) {
            res.status(200).json({
                email   : user.email,
                password: user.password,
                avatar  : user.avatar,
                id      : user._id
            });
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