import { User } from "../mongoose/model/users.js";
import { matchedData, validationResult } from 'express-validator';
import { hashPassword } from "../utils/helpers.js";



export const getUsers = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ error: result.array() });

  if (!req.token || req.token.role !== 'admin') {
    return res.status(403).json({ msg: 'Only admins can view all users' });
  }

  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUpdateUser = async (req, res) => {
if (!req.token) return res.sendStatus(401);
  if (req.token.role === 'user' && req.params.id !== req.token.id) {
    return res.status(403).send({ msg: 'You are not allowed to update other users' });
  }
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ error: result.array() });
  }
  // console.log(req.params.id)
  //  console.log(req.user.id)
  const body = matchedData(req);
  const user = req.user; // middleware


  // Chỉ cho phép cập nhật những field này
  const allowedFields = ['fullname'];

  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      user[field] = body[field];
    }
  });

  try {
    await user.save();
    return res.status(200).send({
      msg: 'User updated successfully'
    });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).send({ msg: 'Internal Server Error', error: err.message });
  }
}

export const getDeleteUserByPatch = async (req, res) => {
  if (!req.token) return res.sendStatus(401);
  if (req.token.role === 'user' && req.params.id !== req.token.id) {
    return res.status(403).send({ msg: 'You are not allowed to delete other users' });
  }
  const user = req.user;
  user.status = 'inactive'
  try {
    await user.save();
    res.send({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send({ msg: 'Internal server error', error: err.message });
  }
}
//hard delete
export const getDeleteUser = async (req, res) => {
  if (!req.token) return res.sendStatus(401);
  if (req.token.role === 'user' && req.params.id !== req.token.id) {
    return res.status(403).json({ msg: 'You are not allowed to delete other users' });
  }

  try {
    await req.user.deleteOne();
    return res.json({ msg: 'User permanently deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ msg: 'Error deleting user', error: error.message });
  }
};