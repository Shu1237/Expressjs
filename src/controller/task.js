
import { validationResult, matchedData } from 'express-validator';
import { Task } from '../mongoose/model/tasks.js';
export const AllTask = async (req, res) => {
    if (req.token.role === 'user') return res.status(403).send({ msg: 'You need login role admin to see this information' })
    try {
        const taks = await Task.find()
            .populate('assignedTo', 'fullname')
            .populate('createdBy', 'fullname');
        const formattedTasks = taks.map(task => ({
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
        res.status(200).send(formattedTasks)
    } catch (error) {
        res.status(500).send(error);
    }
}
export const CreateTask = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    const data = matchedData(req);
    try {
        const checkRole = req.token.role
        let createdTasks = [];
        if (checkRole.toLowerCase() === 'user') { // self_create task
            if (data.assignedTo) {
                return res.status(403).json({ message: 'Users can only assign tasks to themselves' });
            }
            const newTask = new Task({
                ...data,
                assignedTo: req.user.id,
                createdBy: req.user.id,
            });
            await newTask.save();
            createdTasks.push(newTask);
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
                    createdBy: req.user.id,
                });
                await task.save();
                createdTasks.push(task);
            }
        }

        return res.status(201).send({
            msg: 'Create Successful',
            tasks: createdTasks,
        });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(400).send({ message: 'Create Failed', error: error.message });
    }
}
export const UpdateTask = async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }

    const { task, user } = req;
    const data = matchedData(req);

    if (task.status === 'done') {
        return res.status(400).send({ msg: 'Cannot update a completed task' });
    }


    if (user.role === 'user' && user.id !== task.createdBy.toString()) {
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


export const DeleteTaskByPatch = async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    const { task, user } = req.task;

    if (task.status === 'cancel') {
        return res.status(400).send({ msg: 'Task is already canceled' });
    }

    if (user.role === 'user' && user.id !== task.createdBy.toString()) {
        return res.status(403).send({ msg: 'You are not allowed to cancel this task' });
    }

    try {
        task.status = 'cancel';
        const updatedTask = await task.save();
        res.send({ msg: 'Task canceled successfully', task: updatedTask });
    } catch (err) {
        console.error('Error canceling task:', err);
        res.status(500).send({ msg: 'Internal server error', error: err.message });
    }
};
export const DeleteTask = async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    try {
        await req.task.deleteOne(); // hoặc: Task.findByIdAndDelete(req.params.id)
        res.send({ msg: 'Task deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).send({ msg: 'Error deleting task', error: err.message });
    }
}