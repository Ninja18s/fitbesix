const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_key } = require('../config');
const logger = require('../utils/logger');


const authMiddleware = async (req, res, next) => {

    const token = req.headers['authorization'];

    try {
        if (!token) {
            logger.error('token missing')
            throw new Error('token missing')
        }




        const decoded = jwt.verify(token, JWT_key, function (err, decoded) {
            if (err) {

                throw new Error("token expire")
            }
            return decoded
        });
        if (!decoded) {
            throw new Error('token expired')
        }

        const _id = decoded._id;

        const user = await User.findOne({ _id, token });

        if (!user) {
            throw new Error('unauthorized ');
        }
        if (user.isBlacklisted) {
            throw new Error('user is blacklisted');
        }
        req._id = _id;


        next();

    } catch (error) {
        next(error);
    }
}


module.exports = authMiddleware;