import { Router } from "express";
import routerUser from './users.js'
import routerAuth from "./auth.js"
import routerTasks from './tasks.js'



const router = Router()


router.use(routerUser)
router.use(routerAuth)
router.use(routerTasks)
export default router;
