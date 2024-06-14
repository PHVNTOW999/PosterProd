const {create, allByUUID, update, remove} = require("../controllers/comment");
const express = require("express");
const {auth} = require("../middleware/auth");
const router = express.Router();

//create comment with post uuid
router.post('/create/:uuid', auth, create)
// get all comment by user (uuid)
router.get('/all/:uuid', auth, allByUUID)
// update comment by comment uuid
router.post('/update/:uuid', auth, update)
//delete comment by comment uuid
router.post('/remove/:uuid', auth, remove)

module.exports = router;