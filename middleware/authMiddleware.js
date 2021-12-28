const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_key } = require('../config');
const logger = require('../utils/logger');


const authMiddleware = async (req, res, next) => {

    const token = req.headers['authorization'];

    try {
        if (!token) {
            return res.status(403).send({
                resCode: 1,
                message: 'FAILED',
                msg: "token expire"
            })
        }




        const decoded = jwt.verify(token, JWT_key, function (err, decoded) {
            if (err) {

                return res.status(403).send({
                    resCode: 1,
                    message: 'FAILED',
                    msg: "token expire"
                })
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