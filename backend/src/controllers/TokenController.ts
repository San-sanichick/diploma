import { Request, Response } from "express";
import { verify, sign } from "jsonwebtoken";
import { getToken } from "../utils/utils";
import config from "../config/config";

export default class TokenController {
    public async genToken(req: Request, res: Response) {
        console.log("HAHAHAH", req.body);
        const { refreshToken } = req.body;
        verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
            if (err) {
                res.status(401).json({msg: "Unauthorized"});
            }
            if (decoded) {
                const payload = {
                    id      : decoded.id,
                    username: decoded.username
                };

                sign(payload, config.REFRESH_TOKEN_SECRET, {expiresIn: config.ACCESS_TOKEN_LIFE}, (error, token) => {
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