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

const router = Router();


router.get('/users', verifyJWT, getUsers);


router.put('/users/:id', verifyJWT, checkRequestUser, updateAccoutSchema, getUpdateUser);


router.patch('/users/:id/soft-delete', verifyJWT, checkRequestUser, getDeleteUserByPatch);


router.delete('/users/:id', verifyJWT, checkRequestUser, getDeleteUser);

export default router;
