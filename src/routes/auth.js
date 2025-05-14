
import { Router } from "express";

import { Home, LoginStatus, LoginUser, Logout } from "../controller/auth.js";



const router = Router();


router.get('/',Home);
router.post('/login',LoginUser );
router.get('/login/status',LoginStatus );
router.post('/logout',Logout);


export default router