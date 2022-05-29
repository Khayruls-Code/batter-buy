const express = require("express");
const { registerUser, loginUser, logoutUser, forgatePassword, resetPassword } = require("../controllers/userController");
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgote').post(forgatePassword)
router.route('/password/reset/:token').put(resetPassword)

module.exports = router;