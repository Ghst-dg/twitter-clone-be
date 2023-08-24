const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) 
    {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    jwt.verify(token, 'test', (error, user) => {

        if (error) 
        {
        return res.status(401).json({ message: 'Authentication failed' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;