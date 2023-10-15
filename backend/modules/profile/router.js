const router = require("express").Router()
const profile = require("./controller.js")

router.get("/profile", profile.retrieveProfileData)
router.post("/createProfile", profile.create)
router.put("/updateProfile", profile.update)

module.exports = router
