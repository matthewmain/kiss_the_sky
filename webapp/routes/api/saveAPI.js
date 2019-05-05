const router = require("express").Router()
const saveController = require("../../controllers/saveController")
const passport = require('../../passport')

// 💾 🌺 "/api/save" +
router.route("/")
  .post(saveController.savedGames)
  .put(saveController.saveGame)

module.exports = router
