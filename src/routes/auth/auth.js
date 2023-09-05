const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const connection = require('../../config/db');
const { getUserByEmail, registerUser, updateUserToken } = require('../user/user.query.js');


router.post('/register', async (req, res) => {
    const { email, password, name, firstname } = req.body;
    if (!email || !password || !name || !firstname)
        return res.status(400).json({ message: 'Bad parameter' });

    try {
        const results = await getUserByEmail(email);

        if (results.length > 0) {
            return res.status(400).json({ msg: 'Account already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await registerUser(email, hashedPassword, name, firstname);
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: "Token of the newly registered user" });

        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Bad parameter' });

    try {
        const results = await getUserByEmail(email);

        if (results.length === 0) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        } else {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ msg: 'Invalid Credentials' });
            } else {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5h' });
                await updateUserToken(token, user.id);
                console.log("Token of the newly logged in user: ", token);
                return res.status(200).json({ token: token, message: "Token of the newly logged in user" });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
