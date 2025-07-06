const Task = require('../models/taskModel');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // Ordenar por las más recientes primero
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.status(200).json(task);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de tarea inválido' });
        }
        res.status(500).json({ message: err.message });
    }
};

exports.createTask = async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'El título es obligatorio' });
    }

    const newTask = new Task({
        title,
        description
    });

    try {
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        if (err.name === 'ValidationError') {
            let messages = {};
            for (let field in err.errors) {
                messages[field] = err.errors[field].message;
            }
            return res.status(400).json({ errors: messages });
        }
        res.status(500).json({ message: err.message });
    }
};

exports.updateTask = async (req, res) => {
    const { title, description, completed } = req.body;

    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (completed !== undefined) task.completed = completed;

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de tarea inválido' });
        }
        if (err.name === 'ValidationError') {
            let messages = {};
            for (let field in err.errors) {
                messages[field] = err.errors[field].message;
            }
            return res.status(400).json({ errors: messages });
        }
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.status(200).json({ message: 'Tarea eliminada correctamente' });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'ID de tarea inválido' });
        }
        res.status(500).json({ message: err.message });
    }
};