const router = require("express").Router()
const manifestRoutes = require("./manifestAPI.js")

// 🧮
router.use("/manifest", manifestRoutes)

module.exports = router
