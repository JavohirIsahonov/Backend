const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Foydalanuvchi modeli

const protect = async (req, res, next) => {
    let token;

    // Tokenni headerdan olish
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token mavjud emas, avtorizatsiya talab qilinadi' });
    }

    try {
        // Tokenni dekodlash
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Foydalanuvchini bazadan topish
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token noto‘g‘ri' });
    }
};

module.exports = protect;