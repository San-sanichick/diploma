import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import { UserModel } from "../db/models/UserModel";
import config from "../config/config";

const 
    LocalStrategy = passportLocal.Strategy,
    JwtStrategy   = passportJwt.Strategy,
    ExtractJwt    = passportJwt.ExtractJwt;


    
// passport.use(new LocalStrategy({usernameField: "email"}, (email: string, password: any, done: any) => {
//     UserModel.findOne({email: email.toLowerCase()}, (err: any, user: any) => {
//         if (err) {
//             return done(err);
//         }
//         if (!user) {
//             return done(undefined, false, {msg: `User with email ${email} not found`});
//         }

//         user.comparePassword(password, (err: Error, isMatch: boolean) => {
//             if (err) return done(err);
//             if (isMatch) {
//                 return done(undefined, user);
//             }
//             return done(undefined, false, {msg: "Invalid email or password"});
//         });
//     });
// }));

// passport.use(new JwtStrategy(
//     {
//         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//         secretOrKey: config.JWT_SECRET,
//     },
//     (jwtToken, done) => {
//         UserModel.findOne({email: jwtToken.email}, (err, user) => {
//             if (err) return done(err, false);
//             if (user) {
//                 return done(undefined, user, jwtToken);
//             } else {
//                 return done(undefined, false);
//             }
//         })
//     }
// ));