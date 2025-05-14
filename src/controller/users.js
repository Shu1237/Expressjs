import { User } from "../mongoose/model/users.js";
import { matchedData, validationResult } from 'express-validator';
import { hashPassword } from "../utils/helpers.js";



export const getUsers = async (req, res) => {
   const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ error: result.array() });
  }
  if(!req.cookies?.token) return res.sendStatus(401)
 const username = req.query.username;
  try {
    let users;
    if (username) {
      users = await User.find({
        username: { $regex: username, $options: 'i' }
      });
    } else {
      users = await User.find();
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUpdateUser =async (req, res) => {
  if (!req.user) return res.sendStatus(401);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ error: result.array() });
  }

  const body = matchedData(req);
  const user = req.user;

  // Chỉ cho phép cập nhật những field này
  const allowedFields = ['fullname'];

  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      user[field] = body[field];
    }
  });

  try {
    const updatedUser = await user.save();
    return res.status(200).send({
      msg: 'User updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).send({ msg: 'Internal Server Error', error: err.message });
  }
}

export const getDeleteUserByPatch = async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const user = req.userData;
  user.status = 'inactive'
  try {
    const updateStatusUser = await user.save();
    res.send({ msg: 'User deleted successfully', user: updateStatusUser });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send({ msg: 'Internal server error', error: err.message });
  }
}
//hard delete
export const getDeleteUser=async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  try {
    await req.userData.deleteOne();
    res.send({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', err);
    res.status(500).send({ msg: 'Error deleting user', error: err.message });
  }
}