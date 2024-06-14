const express = require('express');
const {login, register, current, user} = require("../controllers/user");
const {auth} = require("../middleware/auth");
const router = express.Router();

router.post('/login', login)
router.post('/register', register)
router.get('/byid/:uuid', user)
router.get('/current', auth, current)
// del user need

module.exports = router;