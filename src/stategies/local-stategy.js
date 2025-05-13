import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from '../mongoose/model/users.js';
import { comparedPassword } from "../utils/helpers.js";

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await User.findById(id);
        if (!findUser) return done(null, false);
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }
});

export default passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const findUser = await User.findOne({ username });
            if (!findUser) {
                return done(null, false, { message: 'User not found' });
            }
            const isMatch = await comparedPassword(password, findUser.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials' });
            }
            return done(null, findUser);
        } catch (error) {
            return done(error);
        }
    })
);

