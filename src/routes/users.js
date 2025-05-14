
import { Router } from 'express';
import { matchedData, query, validationResult } from 'express-validator';
import { hashPassword } from '../utils/helpers.js';
import { User } from '../mongoose/model/users.js';
import { createAccountSchema, updateAccoutSchema } from '../utils/validationSchema.js';
import { checkRequestUser } from '../utils/middleware.js';
import { getDeleteUserByPatch, getRegister, getUpdateUser, getUsers, getDeleteUser } from '../controller/users.js';



const router = Router();
//get 
router.get('/users', getUsers)
//query
router.get(
  '/users',
  query("username")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Username must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be 3-10 characters"),
  getUsers
)


//create 
router.post('/register', createAccountSchema, getRegister)
//update
router.put('/updateUser/:id', checkRequestUser, updateAccoutSchema, getUpdateUser);
//delete
router.patch('/deleteUser/:id', checkRequestUser, getDeleteUserByPatch)

// router.delete('/deleteUser/:id', checkRequestUser,getDeleteUser )
export default router;