
import {  Router } from 'express';
import { Task } from '../mongoose/model/tasks.js';
import { createTaskSchema } from '../utils/validationSchema.js';
import { validationResult, matchedData } from 'express-validator';
import { checkRequestTask, verifyJWT } from '../utils/middleware.js';


const router = Router();

//admin
router.get('/tasks', async (req, res) => {
    try {
        const taks = await Task.find();
        res.status(200).send(taks)
    } catch (error) {
        res.status(500).send(error);
    }
});
router.post('/createTask',verifyJWT, createTaskSchema, async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }

    const data = matchedData(req);
    console.log('Validated data:', data);

    try {
        const newTask = new Task({
            ...data,
            createdBy: req.user.id,
        });

        await newTask.save();

        return res.status(201).send({
            msg: 'Create Successful',
            task: newTask,
        });

    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(400).send({ message: 'Create Failed', error: error.message });
    }
});
router.put('/updateTask/:id',verifyJWT, checkRequestTask, createTaskSchema, async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    const { task } = req; //full data 
    const body = matchedData(req)
    if (task.status === 'done') {
        return res.status(400).send({ msg: 'Cannot update a completed task' });
    }

    const allowedFields = ['name', 'description', 'date', 'status'];
    allowedFields.forEach(field => {
        if (body[field] !== undefined) {
            task[field] = body[field];
        }
    });
    try {
        const updatedTask = await task.save();
        return res.status(200).send({
            msg: 'Task updated successfully',
            task: updatedTask
        });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).send({ msg: 'Internal server error' });
    }


});

//router patch delete
router.patch('/deleteTask/:id',verifyJWT, checkRequestTask, async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const task = req.task;
    if (task.status === 'cancel') {
        return res.status(400).send({ msg: 'Task is already canceled' });
    }
    task.status = 'cancel';

    try {
        const updatedTask = await task.save();
        res.send({ msg: 'Task canceled successfully', task: updatedTask });
    } catch (err) {
        console.error('Error canceling task:', err);
        res.status(500).send({ msg: 'Internal server error', error: err.message });
    }
});


// router.delete('/deleteTask/:id', checkRequestTask, async (req, res) => {
//   if (!req.user) return res.sendStatus(401);

//   try {
//     await req.task.deleteOne(); // hoặc: Task.findByIdAndDelete(req.params.id)
//     res.send({ msg: 'Task deleted successfully' });
//   } catch (err) {
//     console.error('Delete error:', err);
//     res.status(500).send({ msg: 'Error deleting task', error: err.message });
//   }
// });







export default router


