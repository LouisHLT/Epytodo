const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorizathion denied' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
        return res.status(401).json({ message: 'Token error' });
    }

    const token = parts[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        req.user = decoded;
        next();
    });
};
