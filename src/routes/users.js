
import { Router } from 'express';
import { matchedData, query, validationResult } from 'express-validator';
import { hashPassword } from '../utils/helpers.js';
import { User } from '../mongoose/model/users.js';
import { createAccountSchema, updateAccoutSchema } from '../utils/validationSchema.js';
import { checkRequestUser } from '../utils/middleware.js';



const router = Router();
router.get('/users', async (req, res) => {
  try {
    const listUser = await User.find();
    res.status(200).send(listUser)
  } catch (error) {
    res.status(500).send(error);
  }
})
// router.get(
//     '/users',
//     query("username")
//         .optional()
//         .isString()
//         .notEmpty()
//         .withMessage("Username must not be empty")
//         .isLength({ min: 3, max: 10 })
//         .withMessage("Must be 3-10 characters"),
//     async (request, response) => {
//         const result = validationResult(request);
//         if (!result.isEmpty()) {
//             return response.status(400).send({ error: result.array() });
//         }

//     }
// );

//create 
router.post('/register', createAccountSchema, async (request, response) => {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    return response.status(400).send({ error: result.array() })
  }

  const data = matchedData(request);
  const existingUser = await User.findOne({ username: data.username });
  if (existingUser) {
    return response.status(409).json({
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
})

router.put('/updateUser/:id', checkRequestUser, updateAccoutSchema, async (req, res) => {
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
});

router.patch('/deleteUser/:id', checkRequestUser, async (req, res) => {
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
})

// router.delete('/deleteUser/:id', checkRequestUser, async (req, res) => {
//   if (!req.user) return res.sendStatus(401);
//   try {
//     await req.userData.deleteOne();
//     res.send({ msg: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Delete error:', err);
//     res.status(500).send({ msg: 'Error deleting user', error: err.message });
//   }
// })



export default router;