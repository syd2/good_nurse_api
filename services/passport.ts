const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
import { User } from "../models/user.model"

const authJwt = (passport) => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    }
    passport.use(
        new JwtStrategy(opts, (jwtPayload, done) => {
            User.findOne({ email: jwtPayload.email }, (err, user) => {
                if (err) {
                    return done(err, false)
                }
                if (user) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            })
        })
    )
}

export const setAuthentication = (passport) => {
    authJwt(passport)
}
