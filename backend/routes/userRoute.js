const express = require("express");
const { registerUser, loginUser, logoutUser, forgatePassword, resetPassword, getUserDetails, updateUserPassword, updateUserDetails, getAllUsers, getSingleUser, updateUserRole, deleteUser, createProductReviews, getAllReviews, deleteReview } = require("../controllers/userController");
const { getAuthenTicateUser, checkRoles } = require("../middleware/auth");
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgote').post(forgatePassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/me').get(getAuthenTicateUser, getUserDetails)
router.route('/update/password').put(getAuthenTicateUser, updateUserPassword)
router.route('/update/me').put(getAuthenTicateUser, updateUserDetails)
router.route("/admin/all/users").get(getAuthenTicateUser, checkRoles("admin"), getAllUsers)
router.route("/admin/user/:id").get(getAuthenTicateUser, checkRoles("admin"), getSingleUser)
router.route("/admin/user/:id").put(getAuthenTicateUser, checkRoles("admin"), updateUserRole).delete(getAuthenTicateUser, checkRoles("admin"), deleteUser)
router.route("/reviews").put(getAuthenTicateUser, createProductReviews)
router.route("/reviews").get(getAllReviews).delete(getAuthenTicateUser, deleteReview)

module.exports = router;