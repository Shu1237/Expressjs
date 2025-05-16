import mongoose from 'mongoose';
import { Task } from '../mongoose/model/tasks.js';
import { User } from '../mongoose/model/users.js';
import jwt from 'jsonwebtoken';
export const checkRequestTask = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ msg: 'Invalid Task ID' });
  }
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send({ msg: 'Task not found' });
    }
    req.task = task;
    next(); 
  } catch (error) {
    console.error('Error checking task:', error);
    return res.status(500).send({ msg: 'Internal Server Error' });
  }
};

export const checkRequestUser =async (req,res,next)=>{
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ msg: 'Invalid user ID' });
  } 
   try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ msg: 'User not found' });
    }
    req.user = user;
    next(); 
  } catch (error) {
    console.error('Error checking user:', error);
    return res.status(500).send({ msg: 'Internal Server Error' });
  }
}
export const verifyJWT = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.status(401).json({ msg: 'Token required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    req.token = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

