const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../utils/logger');


const authMiddleware = async (req, res, next) => {

    const token = req.headers['authorization'];

    try {
        if (!token) {
            logger.error('token missing')
            return res.status(403).send({
                resCode: 0,
                msg: 'missing token'
            })
        }



        const decoded = jwt.verify(token, 'ice-cream');



        const _id = decoded._id;

        const user = await User.findOne({ _id, 'tokens.token': token });

        if (!user) {
            throw new Error('unauthorized ');
        }
        req._id = _id;


        next();

    } catch (error) {
        next(error);
    }
}


module.exports = authMiddleware;