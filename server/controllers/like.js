const {returnJSON, returnError} = require("../utils/messenger");
const {prisma} = require("../prisma/prisma-client");

const create = async (req, res) => {
    try {
        const isLiked = await prisma.like.findFirst({
            where: {
                userUUID: req.user.uuid,
                postUUID: req.params.uuid
            }
        })

        if(!isLiked) {
            const like = await prisma.like.create({
                data: {
                    userUUID: req.user.uuid,
                    postUUID: req.params.uuid
                }
            })

            return returnJSON(req, res, like)
        } else {
            return returnJSON(req, res, 'Error, that post was liked')
        }
    } catch (error) {
        return returnError(req, res, error)
    }
}

const allByUUID = async (req, res) => {
    try {
        const likes = await prisma.like.findMany({
            where: {
                userUUID: req.params.uuid
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        return returnJSON(req, res, likes)
    } catch (error) {
        return returnError(req, res, error)
    }
}

const remove = async (req, res) => {
    try {
        const like = await prisma.like.delete({
            where: {
                uuid: req.params.uuid
            }
        })

        return returnJSON(req, res, like)
    } catch (error) {
        return returnError(req, res, error)
    }
}

module.exports = {
    create,
    allByUUID,
    remove,
}