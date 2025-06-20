import Task from "../models/Task.js";

//Create Task
export const createTask = async (req, res) => {
    try {
        const { title, status, description, color, repeat, tags } = req.body;

        if (!title || !status || !description || !color || !repeat || !tags) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const task = new Task({
            title,
            status,
            description,
            color,
            repeat,
            tags,
            createdBy : req.user._id
        });

        const savedTask = await task.save();
        res.status(201).json({savedTask});
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}

//View Task
export const getAllTask = async (req, res) => {
    try {
        const { status } = req.query;

        const query = {createdBy: req.user._id};

        if(status) {
            query.status = status;
        }

        const tasks = await Task.find(query).sort({createdAt: -1});
        
        res.status(201).json({tasks})
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

//Update Task
export const updateTask = async (req, res) => {
    try {
        const { title, status, description, color, repeat, tags } = req.body;
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if(!task) {
            return res.status(400).json({message: 'Task not found'})
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this task' });
        }

        if (title !== undefined) task.title = title;
        if (status !== undefined) task.status = status;
        if (description !== undefined) task.description = description;
        if (color !== undefined) task.color = color;
        if (repeat !== undefined) task.repeat = repeat;
        if (tags !== undefined) task.tags = tags;

        await task.save();

        res.status(200).json(task)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

//Delete Task
export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId)

        if(!task) {
            res.status(401).json({message: 'Task not found'})
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();

        res.status(200).json({message: 'Task deleted succesfully'});

    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

//Task Details
export const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);

        if(!task) {
            res.status(400).json({message: 'Task not found'})
        }

        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to access this task' });
        }

        res.status(200).json({task})
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}