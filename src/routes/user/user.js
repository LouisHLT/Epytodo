const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getUserInfo, getUserTodo, getUserById, getUserByEmail, deleteUserById, updateUserById} = require('./user.query');

router.get('/user', async (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Authorization header is missing' });
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log("UserId: ", userId);

        const userInfo = await getUserInfo(userId);
        console.log("User Information: ", userInfo);
        return res.json(userInfo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/user/todos', async (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Authorization header is missing' });
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log("UserId: ", userId);

        const todos = await getUserTodo(userId);
        console.log("Todos: ", todos);

        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/users/:identifier', async (req, res) => {
    const identifier = req.params.identifier;

    try {
        let userInfo;
        if(/^\d+$/.test(identifier)) {
            userInfo = await getUserById(identifier);
        } else {
            userInfo = await getUserByEmail(identifier);
        }
        if (!userInfo) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        console.log("User Information: ", userInfo);
        return res.json(userInfo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/users/:identifier', async (req, res) => {
    const identifier = req.params.identifier;

    const { firstname, name, email, password } = req.body;

    if (!firstname || !name || !email || !password) {
        res.status(400).json({ error: 'Bad parameter' });
        return;
    }

    try {
        const updateUser = await updateUserById(identifier, email, password, name, firstname);
        if (!updateUser) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        const userInfo = await getUserById(identifier);
        return res.json(userInfo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



router.delete('/users/:identifier', async (req, res) => {
    const identifier = req.params.identifier;

    try {
        let userInfo;
        let result;

        if(/^\d+$/.test(identifier)) {
            userInfo = await getUserById(identifier);
            if (!userInfo) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            result = await deleteUserById(identifier);
        } else {
            userInfo = await getUserByEmail(identifier);
            if (!userInfo) {
                res.status(404).json({ error: 'Not found' });
                return;
            }
            result = await deleteUserByEmail(identifier);
        }
        if (result)
            res.json({ msg: `Successfully deleted record number: ${identifier}` });
        else
            res.status(500).json({ error: 'Internal server error' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;