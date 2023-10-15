const router = require("express").Router()
const comment = require("./controller.js")
    
router.delete("/comment/", comment.delete)
router.post("/comment/", comment.create)
router.put("/comment/", comment.update)

module.exports = router
