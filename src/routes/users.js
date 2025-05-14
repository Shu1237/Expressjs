
import { Router } from 'express';
import { createAccountSchema, updateAccoutSchema, validateUsernameQuery } from '../utils/validationSchema.js';
import { checkRequestUser, verifyJWT } from '../utils/middleware.js';
import { getDeleteUserByPatch, getUpdateUser, getUsers, getDeleteUser } from '../controller/users.js';



const router = Router();
//get 
router.get('/users',verifyJWT, getUsers)
//query
router.get('/users',verifyJWT, validateUsernameQuery, getUsers)

//update
router.put('/updateUser/:id', verifyJWT,checkRequestUser, updateAccoutSchema, getUpdateUser);
//delete
router.patch('/deleteUser/:id',verifyJWT, checkRequestUser, getDeleteUserByPatch)

// router.delete('/deleteUser/:id',verifyJWT, checkRequestUser,getDeleteUser )
export default router;