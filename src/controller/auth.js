
import jwt from 'jsonwebtoken';
import { Task } from "../mongoose/model/tasks.js";
import { User } from "../mongoose/model/users.js";
import { comparedPassword, hashPassword } from "../utils/helpers.js";
import { validationResult, matchedData } from 'express-validator';

export const Home = async (req, res) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(200).send({ msg: 'Welcome! Please login.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const listtask = await Task.find({ createdBy: decoded.id });
        res.status(200).send({
            msg: listtask.length === 0 ? 'Welcome! No tasks found.' : 'Welcome back!',
            user: { id: decoded.id, username: decoded.username },
            tasks: listtask,
        });
    } catch (err) {
        console.error('JWT Error:', err.message);
        return res.status(401).send({ msg: 'Invalid or expired token. Please login again.' });
    }
}


export const getRegister = async (request, response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
        return response.status(400).send({ error: result.array() })
    }

    const data = matchedData(request);
    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) {
        return response.status(409).send({
            message: 'Username already exists'
        });
    }
    // console.log(data)
    data.password = hashPassword(data.password)
    const newUser = User(data)
    try {
        const savedUser = await newUser.save();
        return response.status(201).send({
            message: 'Create Successful',
            user: savedUser
        });
    } catch (error) {
        console.log('Error creating user:', error);
        return response.status(400).send({ message: 'Create Failed', error: error.message });
    }
}
export const LoginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const findUser = await User.findOne({ username });
        if (!findUser) return res.status(404).send("Not found user");

        const isMatch = await comparedPassword(password, findUser.password);
        if (!isMatch) return res.status(400).send({ msg: 'Wrong password' });

        const payload = {
            id: findUser._id,
            username: findUser.username,
            fullname: findUser.fullname,
            role: findUser.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        const { password: _, ...userWithoutPassword } = findUser._doc;
        return res.status(200).send({ msg: 'Login successfully', user: userWithoutPassword });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
export const LoginStatus = (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).send(req.user);
    } else {
        return res.status(401).send({ msg: 'Not Authenticated' });
    }
}
export const Logout = (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 0
    });
    return res.status(200).send({ msg: 'Logout successful' });
}


