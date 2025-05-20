
import { validationResult, matchedData } from 'express-validator';
import { Task } from '../mongoose/model/tasks.js';


export const getAllTasks = async (req, res) => {
    if (req.token.role === 'user') {
        return res.status(403).send({ msg: 'You need admin role to see this information' });
    }

    let { title } = req.query;
    const query = {};

    if (title) {
        title = title.toLowerCase();
        query.title = { $regex: new RegExp(title, 'i') }; 
    }

    try {
        const tasks = await Task.find(query)
            .populate('assignedTo', 'fullname')
            .populate('createdBy', 'fullname');

        const formattedTasks = tasks.map(task => ({
            _id: task._id,
            title: task.title,
            description: task.description,
            startDate: task.startDate,
            dueDate: task.dueDate,
            status: task.status,
            assignedTo: task.assignedTo?.fullname || null,
            createdBy: task.createdBy?.fullname || null,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        }));

        res.status(200).send(formattedTasks);
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error', error });
    }
};


export const createTask = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    const data = matchedData(req);
    try {
        const checkRole = req.token.role
        if (checkRole.toLowerCase() === 'user') { // self_create task
            if (data.assignedTo.length > 0) {
                return res.status(403).json({ message: 'Users can only assign tasks to themselves' });
            }
            const newTask = new Task({
                ...data,
                assignedTo: req.token.id,
                createdBy: req.token.id,
            });
            await newTask.save();
        } else {
            // admin creates task for users
            const assignedIds = Array.isArray(data.assignedTo)
                ? data.assignedTo
                : data.assignedTo
                    ? [data.assignedTo]
                    : [];

            for (const userId of assignedIds) {
                const task = new Task({
                    ...data,
                    assignedTo: userId,
                    createdBy: req.token.id,
                });
                await task.save();
            }
        }

        return res.status(201).send({
            msg: 'Create Successful',
        });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(400).send({ message: 'Create Failed', error: error.message });
    }
}
export const updateTask = async (req, res) => {
    if (!req.task) return res.sendStatus(401);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }

    const { task, token } = req;
    const data = matchedData(req);

    if (task.status === 'done') {
        return res.status(400).send({ msg: 'Cannot update a completed task' });
    }


    if (token.role === 'user' && token.id !== task.createdBy.toString()) {
        return res.status(403).send({ msg: 'You are not allowed to update this task,Please Login by Admin to ' });
    }

    try {
        const allowedFields = ['title', 'description', 'startDate', 'dueDate'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                task[field] = data[field];
            }
        });

        const updatedTask = await task.save();
        return res.status(200).send({
            msg: 'Task updated successfully',
            task: updatedTask
        });

    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).send({ msg: 'Internal server error' });
    }
};

export const updateTaskStatus = async (req, res) => {
    const { task, token } = req;
    if (!token) return res.sendStatus(401);
    if (task.status === 'done') {
        return res.status(400).send({ msg: 'Task is already completed' });
    }

    if (token.role === 'user' && token.id !== task.createdBy.toString()) {
        return res.status(403).send({ msg: 'You are not allowed to update this task' });
    }

    try {
       switch (task.status) {
        case 'todo':
        task.status = 'in_progress';
        break;
        case 'in_progress':
        task.status = 'done';
        break;
        case 'cancel':
        return res.status(400).send({ msg: 'Task is already canceled' });
        case 'done':
        return res.status(400).send({ msg: 'Task is already completed' });
        default:
        return res.status(400).send({ msg: 'Invalid task status' });
    }
        await task.save();
        res.send({ msg: ' Updated status successfully' });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send({ msg: 'Internal server error', error: err.message });
    }
}
export const softDeleteTask = async (req, res) => {
    const { task, token } = req;
    if (!token) return res.sendStatus(401);
    if (task.status === 'cancel') {
        return res.status(400).send({ msg: 'Task is already canceled' });
    }

    if (token.role === 'user' && token.id !== task.createdBy.toString()) {
        return res.status(403).send({ msg: 'You are not allowed to cancel this task' });
    }

    try {
        task.status = 'cancel';
        await task.save();
        res.send({ msg: 'Task canceled successfully' });
    } catch (err) {
        console.error('Error canceling task:', err);
        res.status(500).send({ msg: 'Internal server error', error: err.message });
    }
};
export const hardDeleteTask = async (req, res) => {
    const { task, token } = req;
    if (!token) return res.sendStatus(401);
    if (token.role === 'user' && token.id !== task.createdBy.toString()) {
        return res.status(403).send({ msg: 'You are not allowed to cancel this task' });
    }

    try {
        await task.deleteOne();
        res.send({ msg: 'Task deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).send({ msg: 'Error deleting task', error: err.message });
    }
}