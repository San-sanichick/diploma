import { Request, Response } from "express";
import { verify, sign } from "jsonwebtoken";
import config from "../config/config";
import { getToken } from "../utils/utils";

export default class TokenController {
    public async genToken(req: Request, res: Response) {
        let { refreshToken } = req.body;
        refreshToken = refreshToken.split(" ")[1];
        verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
            if (err) {
                res.status(401).json({msg: "Unauthorized"});
            }
            if (decoded) {
                const payload = {
                    id      : decoded.id,
                    username: decoded.username
                };

                sign(payload, config.ACCESS_TOKEN_SECRET, {expiresIn: config.ACCESS_TOKEN_LIFE}, (error, token) => {
                    if (error) {
                        res.status(401).json({msg: "Unathorized"});
                    }
                    res.status(200).json({
                        token  : "Bearer " + token,
                        success: true
                    });
                });
            }
        });
    }
}