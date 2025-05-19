import { Router } from 'express';
import { createTaskSchema } from '../utils/validationSchema.js';
import { checkRequestTask, verifyJWT } from '../utils/middleware.js';
import {
  getAllTasks,
  createTask,
  updateTask,
  softDeleteTask,
  hardDeleteTask
} from '../controller/task.js';

const router = Router();


router.get('/tasks', verifyJWT, getAllTasks);
router.post('/tasks', verifyJWT, createTaskSchema, createTask);
router.put('/tasks/:id', verifyJWT, checkRequestTask, createTaskSchema, updateTask);
router.patch('/tasks/:id/soft-delete', verifyJWT, checkRequestTask, softDeleteTask);
router.delete('/tasks/:id', verifyJWT, checkRequestTask, hardDeleteTask);

export default router;
