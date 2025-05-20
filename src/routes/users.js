import { Router } from 'express';
import {
  updateAccoutSchema,
  validateUsernameQuery,
} from '../utils/validationSchema.js';
import {
  checkRequestUser,
  verifyJWT,
} from '../utils/middleware.js';
import {
  getDeleteUserByPatch,
  getUpdateUser,
  getUsers,
  getDeleteUser,
} from '../controller/users.js';
import { query } from 'express-validator';

const router = Router();


router.get('/users', query("fullname")
  .optional()
  .isString()
  .notEmpty().withMessage("Username must not be empty")
  .isLength({ min: 3, max: 10 })
  .withMessage("Must be 3-10 characters"), verifyJWT, getUsers);


router.put('/users/:id', verifyJWT, checkRequestUser, updateAccoutSchema, getUpdateUser);


router.patch('/users/:id/soft-delete', verifyJWT, checkRequestUser, getDeleteUserByPatch);


router.delete('/users/:id', verifyJWT, checkRequestUser, getDeleteUser);

export default router;
