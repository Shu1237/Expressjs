
import jwt from 'jsonwebtoken';
import { Task } from "../mongoose/model/tasks.js";
import { User } from "../mongoose/model/users.js";
import { comparedPassword, hashPassword } from "../utils/helpers.js";
import { validationResult, matchedData } from 'express-validator';

export const Home = async (req, res) => {
    const token = req.cookies?.access_token;
    if (!token) {
        return res.status(200).send({ msg: 'Welcome! Please login.' });
    }
   
   try {
    const tasks = await Task.find()
        .populate('assignedTo', 'fullname username')
        .populate('createdBy', 'fullname username');
    const formattedTasks = tasks.map(task => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        startDate: task.startDate,
        dueDate: task.dueDate,
        status: task.status,
        assignedTo: task.assignedTo
            ? {
                _id: task.assignedTo._id,
                fullname: task.assignedTo.fullname,
                username: task.assignedTo.username
              }
            : null,
        createdBy: task.createdBy
            ? {
                _id: task.createdBy._id,
                fullname: task.createdBy.fullname,
                username: task.createdBy.username
              }
            : null,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    }));

    res.status(200).send(formattedTasks);
} catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'Internal server error', error });
}
};
export const getRegister = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }

    const data = matchedData(req);

    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) {
        return res.status(409).send({
            message: 'Username already exists'
        });
    }

    data.password = hashPassword(data.password);
    if (data.role==='user') {
        data.role = 'user';
    }else {
         data.role = 'admin';
    }

   
    // if (data.role.toLowerCase() === 'admin') {
    //     if (!req.token || req.token.role?.toLowerCase() !== 'admin') {
    //         return res.status(403).json({ message: 'Chỉ admin mới có quyền tạo tài khoản admin' });
    //     }
    // }

    const newUser = new User(data);

    try {
        await newUser.save();
        return res.status(201).send({
            message: 'Create Successful'
        });
    } catch (error) {
        console.log('Error creating user:', error);
        return res.status(400).send({ message: 'Create Failed', error: error.message });
    }
};

export const LoginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const findUser = await User.findOne({ username });
        if (!findUser) return res.status(404).send("Not found user");
        if(findUser.status.toLocaleLowerCase() === 'inactive') return res.status(400).send({ msg: 'Your account is not active' });

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
            // httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).send({ msg: 'Login successfully', access_token: token });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
export const Logout = (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 0
    });
    return res.status(200).send({ msg: 'Logout successful' });
}


