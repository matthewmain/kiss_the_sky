const router = require("express").Router()
const winnerController = require("../../controllers/winnerController")

// ⭐️ "/api/winner" +
router.route("/")
  .get(winnerController.winners)
  .post(winnerController.winner)

router.route([
  "/leaderboard",
  "/leaderboard/:difficulty",
  "/leaderboard/:difficulty/:page",
])
  .get(winnerController.leaderboard)

module.exports = router
