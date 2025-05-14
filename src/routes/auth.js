
import { Router } from "express";
import { getRegister, Home, LoginUser, Logout } from "../controller/auth.js";
import { createAccountSchema } from "../utils/validationSchema.js";

const router = Router();


router.get('/',Home);
//create 
router.post('/register', createAccountSchema,getRegister)
router.post('/login',LoginUser );
router.post('/logout',Logout);


export default router