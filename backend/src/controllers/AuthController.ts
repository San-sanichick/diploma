import { Request, Response, NextFunction } from "express";
import passport from "passport";
import "../passport/passportHandler";

export class AuthController {
    public authenticateJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", (err, user, info) => {
            if (err) {
                console.error(err);
                return res.status(401).json({msg: "Unathorized!"});
            } if (!user) {
                return res.status(401).json({msg: "Unathorized!"});
            } else {
                return next();
            }
        })(req, res, next);
    }

    public authorizeJWT(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", (err, user, jwtToken) => {
            if (err) {
                console.error(err);
                return res.status(401).json({msg: "Unathorized!"});
            } if (!user) {
                return res.status(401).json({msg: "Unathorized!"});
            } else {
                const scope = req.baseUrl.split("/").slice(-1)[0];
                const authScope = jwtToken.scope;
                if (authScope && authScope.indexOf(scope) > -1) {
                    return next();
                } else {
                    return res.status(401).json({msg: "Unathorized!"});
                }
            }
        })(req, res, next);
    }
}