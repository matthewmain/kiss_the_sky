const router = require("express").Router()
const manifestController = require("../../controllers/manifestController")

// 🧮 "/api/manifest" +
router.route("/")
  .get(manifestController.getManifest)
  .put(manifestController.incrementPage)

module.exports = router
