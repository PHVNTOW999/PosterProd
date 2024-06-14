const {prisma} = require("../prisma/prisma-client");
const {returnJSON, returnError} = require("../utils/messenger");

const create = async (req, res) => {
    try {
        const data = req.body

        const comment = await prisma.comment.create({
            data: {
                ...data,
                authorUUID: req.user.uuid,
                postUUID: req.params.uuid,
            }
        })

        return returnJSON(req, res, comment)
    } catch (error) {
        return returnError(req, res, error)
    }
}

const allByUUID = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                authorUUID: req.params.uuid
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        return returnJSON(req, res, comments)
    } catch (error) {
        return returnError(req, res, error)
    }
}

const update = async (req, res) => {
    try {
        const data = req.body

        const comment = await prisma.comment.update({
            where: {
                uuid: req.params.uuid
            },
            data: {
                ...data,
            }
        })

        return returnJSON(req, res, comment)
    } catch (error) {
        return returnError(req, res, error)
    }
}

const remove = async (req, res) => {
    try {
        const comment = await prisma.comment.delete({
            where: {
                uuid: req.params.uuid
            }
        })

        return returnJSON(req, res, comment)
    } catch (error) {
        return returnError(req, res, error)
    }
}

module.exports = {
    create,
    allByUUID,
    update,
    remove,
}