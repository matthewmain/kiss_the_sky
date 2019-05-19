const router = require("express").Router()
const manifestController = require("../../controllers/manifestController")

// 🧮 "/api/manifest" +
router.route("/")
  .get(manifestController.getManifest)
  .put(manifestController.incrementPage)

router.route("/userlist")
  .get(manifestController.userList)

router.route("/user/:username")
  .get(manifestController.user)

module.exports = router
