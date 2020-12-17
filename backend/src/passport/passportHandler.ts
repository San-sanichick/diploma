import passport      from "passport";
import passportLocal from "passport-local";
import passportJwt   from "passport-jwt";
import { UserModel } from "../db/models/UserModel";
import config        from "../config/config";

const 
    LocalStrategy = passportLocal.Strategy,
    JwtStrategy   = passportJwt.Strategy,
    ExtractJwt    = passportJwt.ExtractJwt;

let opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey    = config.ACCESS_TOKEN_SECRET;

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findById((jwt_payload.id));
            if (user !== null) {
                return done(null, user);
            }
            return done(null, false);
        } catch (err) {
            console.error(err);
        }
    })
)
