const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { createTodo, getUserTasks, deleteTodoById, getTodoById, updateTask } = require('./todos.query');

router.get('/todos', auth, async (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Authorization header is missing' });
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log("UserId: ", userId);

        const userTasks = await getUserTasks(userId);
        console.log("User's Tasks: ", userTasks);

        if (userTasks.length === 0) {
            res.status(404).json({ error: 'No tasks found for this user.' });
            return;
        }

        res.json(userTasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/todos/:id', auth, async (req, res) => {
    const todoId = req.params.id;

    try {
        const todo = await getTodoById(todoId);
        if (!todo) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        res.json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/todos', auth, async (req, res) => {
    const {title, description, due_time, status} = req.body;
    const userId = req.user.id;


    if (!title || !description || !due_time || !status)
        return res.status(400).json({ message: 'Bad parameter' });

    try {
        const todoId = await createTodo(title, description, due_time, status, userId);
        const token = req.headers.authorization.split(' ')[1];

        const justCreateTodo = await getTodoById(todoId);
        return res.status(200).json(justCreateTodo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/todos/:id', async (req, res) => {
    const taskId = req.params.id;

    const { title, description, due_time, status, user_id } = req.body;

    if (!title || !description || !due_time || !status || !user_id) {
        res.status(400).json({ error: 'Bad parameter' });
        return;
    }

    try {
        const updatedTask = await updateTask(taskId, title, description, due_time, status, user_id);
        if (!updatedTask) {
            res.status(404).json({ error: 'Not found' });
            return;
        }

        const userInfo = await getTodoById(taskId);
        return res.status(200).json(userInfo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/todos/:id', auth, async (req, res) => {
    const todoId = req.params.id;

    try {
        const TodoId = await deleteTodoById(todoId);
        if (!TodoId) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        return res.json({ message: `Successfully deleted record numnber: ${todoId}` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
