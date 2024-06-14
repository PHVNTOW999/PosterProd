const {prisma} = require("../prisma/prisma-client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {returnError, returnJSON} = require("../utils/messenger");
const {del} = require("express/lib/application");
const JWT_SECRET = process.env.JWT_SECRET

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //check required fields
        if (!email || !password) {
            return returnError(req, res, 'Please fill in the required fields')
        }

        // check registered user
        const user = await prisma.user.findFirst({
            where: {
                email,
            }
        });

        // check password
        const isPasswordCorrect = user && (await bcrypt.compare(password, user['password']));

        // send user with jwt
        if (user && isPasswordCorrect && JWT_SECRET) {
            return await returnJSON(req, res, {
                uuid: user['uuid'],
                email: user['email'],
                username: user['username'],
                token: jwt.sign(
                    {uuid: user['uuid']},
                    JWT_SECRET,
                    {expiresIn: "20d"},
                    null)
            })
        } else {
            return returnError(req, res, 'Wrong email or password')
        }
    } catch (error) {
        return returnError(req, res, error)
    }
};
const register = async (req, res) => {
    try {
        const {email, password, username, avatar} = req.body;

        // check required fields
        if (!email || !password || !username) {
            return returnError(req, res, 'Please fill in the required fields')
        }

        // check is registered user
        const registeredUser = await prisma.user.findFirst({
            where: {
                email,
            }
        })

        // if user is registered
        if (registeredUser) {
            return returnError(req, res, 'User with this email address already exists')
        }

        // create user and hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            }
        })

        // create and send jwt with user
        if (user && JWT_SECRET) {
            return await returnJSON(req, res, {
                uuid: user['uuid'],
                avatar: user['avatar'],
                email: user['email'],
                username: user['username'],
                token: jwt.sign(
                    {uuid: user['uuid']},
                    JWT_SECRET,
                    {expiresIn: "20d"},
                    null)
            })
        } else {
            return returnError(req, res, 'Failed to create user')
        }
    } catch (error) {
        return returnError(req, res, error)
    }
}

const user = async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                uuid: req.params.uuid
            },
            include: {
                userPosts: {
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
                    }
                },
                userComments: {
                    include: {
                        post: {
                            select: {
                                uuid: true,
                                author: {
                                    select: {
                                        username: true,
                                        uuid: true,
                                    },
                                },
                                postLikes: true,
                                createdAt: true,
                                text: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
                userLikes: {
                    include: {
                        post: {
                            select: {
                                uuid: true,
                                author: {
                                    select: {
                                        username: true,
                                        uuid: true,
                                    },
                                },
                                postLikes: true,
                                createdAt: true,
                                text: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc',
                    }
                },
            },
        })

        // filter comments from duplicates
        user['userComments'] = user['userComments'].reduce((unique, o) => {
            if (!unique.some(obj => obj.postUUID === o.postUUID &&
                obj.postUUID === o.postUUID)) {
                unique.push(o);
            }
            return unique;
        }, [])

        delete user["email"];
        delete user["password"];

        return returnJSON(req, res, user)
    } catch (error) {
        return returnError(req, res, error)
    }
}

const current = async (req, res) => {
    delete req.user["password"];
    return returnJSON(req, res, req.user)
};

module.exports = {
    login,
    register,
    user,
    current,
}