const router = require("express").Router()
const manifestRoutes = require("./manifestAPI.js")
const userRoutes = require("./userAPI.js")
const saveRoutes = require("./saveAPI.js")

// 🧮
router.use("/manifest", manifestRoutes)
// 👥
router.use("/user", userRoutes)
// 💾 🌺
router.use("/save", saveRoutes)

module.exports = router
