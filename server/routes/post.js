const {create, all, popular, allByUUID, postByUUID, update, remove} = require("../controllers/post");
const {auth} = require("../middleware/auth");
const express = require("express");
const router = express.Router();

//create post
router.post('/create', auth, create)
//get all newest posts
router.get('/all', all)
//get all popular posts
router.get('/popular', popular)
//get all newest posts by user (uuid)
router.get('/all/:uuid', auth, allByUUID)
//get one post by post uuid
router.get('/:uuid', postByUUID)
//update post by uuid
router.post('/update/:uuid', update)
//delete post by uuid
router.post('/remove/:uuid', remove)

module.exports = router;