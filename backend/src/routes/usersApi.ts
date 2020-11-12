import { Router } from "express";
import users from "../dummyData/users";

const usersApi = Router();

usersApi.get("/", (req, res) => {
    res.json(users);
});

usersApi.get("/:email", (req, res) => {
    const exists = users.some(user => user.email == req.params.email);
    if (exists) {
        res.status(200).json(users.find(user => user.email == req.params.email));
    } else {
        res.status(404).json({
            msg: "User not found"
        })
    }
})

export default usersApi