const jwt = require('jsonwebtoken');

// Kullanıcı kimlik doğrulama middleware
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'user') {
            return res.status(403).json({ message: 'Access denied. Not a user.' });
        }
        req.user = decoded; // Kullanıcı bilgilerini req.user'a ekleyin
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticateUser;
