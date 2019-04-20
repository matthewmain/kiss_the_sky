const router = require("express").Router()
const userController = require("../../controllers/userController")
const User = require('../../models/userModel')
const passport = require('../../passport')

// 👥 "/api/user" +
router.route("/")
  .get(userController.getUser)
  .post(userController.logIn)

router.route('/logout')
  .get(userController.logOut)

router.route("/signup")
  .post(userController.signUp)

module.exports = router
