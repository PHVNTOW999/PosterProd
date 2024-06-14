const {create, all, allByUUID, postByUUID, update, remove} = require("../controllers/like");
const express = require("express");
const {auth} = require("../middleware/auth");
const router = express.Router();

// create likes by post uuid
router.post('/:uuid', auth, create)
// get all likes by user (uuid)
router.get('/all/:uuid', auth, allByUUID)
// delete post by post uuid
router.post('/remove/:uuid', auth, remove)

module.exports = router;