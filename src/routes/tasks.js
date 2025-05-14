
import {  Router } from 'express';
import { createTaskSchema } from '../utils/validationSchema.js';
import { checkRequestTask, verifyJWT } from '../utils/middleware.js';
import { AllTask, CreateTask, DeleteTaskByPatch, UpdateTask,DeleteTask } from '../controller/task.js';


const router = Router();


router.get('/tasks', verifyJWT, AllTask);
router.post('/createTask',verifyJWT, createTaskSchema,CreateTask );
router.put('/updateTask/:id',verifyJWT, checkRequestTask, createTaskSchema, UpdateTask);
//router patch delete
router.patch('/deleteTask/:id',verifyJWT, checkRequestTask,DeleteTaskByPatch);
// router.delete('/deleteTask/:id', checkRequestTask,DeleteTask);







export default router


