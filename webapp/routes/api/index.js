const router = require("express").Router()
const manifestRoutes = require("./manifestAPI.js")
const userRoutes = require("./userAPI.js")
const savedRoutes = require("./savedAPI.js")
const winnerRoutes = require("./winnerAPI.js")

// 🧮
router.use("/manifest", manifestRoutes)
// 👥
router.use("/user", userRoutes)
// 💾 🌺
router.use("/saved", savedRoutes)
// ⭐️
router.use("/winner", winnerRoutes)

module.exports = router
