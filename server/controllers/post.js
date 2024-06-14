const {returnJSON, returnError} = require("../utils/messenger");
const {prisma} = require("../prisma/prisma-client");

const create = async (req, res) => {
    try {
        const data = req.body;

        // check required fields
        if (!data.text || !req.user.uuid) {
            return returnError(req, res, 'Please fill in the required fields')
        } else {
            const newPost = await prisma.post.create({
                data: {
                    ...data,
                    authorUUID: req.user.uuid
                }
            })

            return returnJSON(req, res, newPost)
        }
    } catch (error) {
        return returnError(req, res, error)
    }
};

const all = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                postLikes: true,
                author: {
                    select: {
                        username: true,
                        uuid: true,
                    },
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: +req.query.skip || 0,
            take: +req.query.take || 10,
        })

        return returnJSON(req, res, posts)
    } catch (error) {
        return returnError(req, res, error)
    }
}

const popular = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                postLikes: true,
                author: {
                    select: {
                        username: true,
                        uuid: true,
                    },
                }
            },
            orderBy: {
                postLikes: {
                    _count: 'desc'
                }
            },
            skip: +req.query.skip || 0,
            take: +req.query.take || 10,
        })

        return returnJSON(req, res, posts)
    } catch (error) {
        return returnError(req, res, error)
    }
}

const allByUUID = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                authorUUID: req.params.uuid
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        return returnJSON(req, res, posts)
    } catch (error) {
        return returnError(req, res, error)
    }
}

const postByUUID = async (req, res) => {
    try {
        const post = await prisma.post.findFirst({
            where: {
                uuid: req.params.uuid
            },
            include: {
                postLikes: true,
                postComments: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: {
                        uuid: true,
                        author: {
                            select: {
                                username: true,
                                uuid: true,
                            },
                        },
                        text: true,
                        createdAt: true,
                    },
                },
                author: {
                    select: {
                        username: true,
                        uuid: true,
                    },
                },
            },
        })

        return returnJSON(req, res, post)
    } catch (error) {
        return returnError(req, res, error)
    }
}

const update = async (req, res) => {
    try {
        const data = req.body

        const post = await prisma.post.update({
            where: {
                uuid: req.params.uuid
            },
            data: {
                ...data,
            }
        })

        return returnJSON(req, res, post)
    } catch (error) {
        return returnError(req, res, error)
    }
}

const remove = async (req, res) => {
    try {
        const post = await prisma.post.delete({
            where: {
                uuid: req.params.uuid
            }
        })

        return returnJSON(req, res, post)
    } catch (error) {
        return returnError(req, res, error)
    }
}

module.exports = {
    create,
    all,
    popular,
    allByUUID,
    postByUUID,
    update,
    remove,
}