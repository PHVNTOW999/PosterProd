const jwt = require('jsonwebtoken');
const {prisma} = require('../prisma/prisma-client');
const {returnError} = require("../utils/messenger");

const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET, null, null);

        req.user = await prisma.user.findUnique({
            where: {
                uuid: decoded.uuid
            }
        });

        next()
    } catch (error) {
        return returnError(req, res, 'Not authorization token')
    }
}

module.exports = {
    auth
}