const router = require("express").Router()
const user = require("./controller.js")

router.post("/login", user.login)
router.post("/createUser", user.create)

module.exports = router