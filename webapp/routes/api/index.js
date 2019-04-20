const router = require("express").Router()
const manifestRoutes = require("./manifestAPI.js")
const userRoutes = require("./userAPI.js")

// 🧮
router.use("/manifest", manifestRoutes)
// 👥
router.use("/user", userRoutes)

module.exports = router
