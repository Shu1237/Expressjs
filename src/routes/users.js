
import { Router } from 'express';
import { createAccountSchema, updateAccoutSchema, validateUsernameQuery } from '../utils/validationSchema.js';
import { checkRequestUser } from '../utils/middleware.js';
import { getDeleteUserByPatch, getUpdateUser, getUsers, getDeleteUser } from '../controller/users.js';



const router = Router();
//get 
router.get('/users', getUsers)
//query
router.get('/users', validateUsernameQuery, getUsers)



//update
router.put('/updateUser/:id', checkRequestUser, updateAccoutSchema, getUpdateUser);
//delete
router.patch('/deleteUser/:id', checkRequestUser, getDeleteUserByPatch)

// router.delete('/deleteUser/:id', checkRequestUser,getDeleteUser )
export default router;