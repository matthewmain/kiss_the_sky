const router = require("express").Router()
const savedController = require("../../controllers/savedController")
// const passport = require('../../passport')

// 💾 🌺 "/api/save" +
router.route("/")
  .post(savedController.saved)
  .put(savedController.save)

router.route("/resume")
  .post(savedController.resume)

router.route("/delete")
  .post(savedController.delete)

router.route("/update")
  .put(savedController.update)

module.exports = router
