const router = require("express").Router()
const userController = require("../../controllers/userController")
// const passport = require('../../passport')

// 👥 "/api/user" +
router.route("/")
  .get(userController.getUser)
  .post(userController.logIn)

router.route('/logout')
  .get(userController.logOut)

router.route("/signup")
  .post(userController.signUp)

router.route("/checkavailable")
  .post(userController.checkAvailable)

router.route("/changeAvatar")
  .put(userController.changeAvatar)

module.exports = router
