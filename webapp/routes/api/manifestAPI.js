const router = require("express").Router()
const adminController = require("../../controllers/manifestController")

// 🧮 "/api/manifest" +
router.route("/")
  .get(adminController.getManifest)
  .put(adminController.incrementPage)

module.exports = router
