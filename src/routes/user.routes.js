const { register, login } = require("../controllers/user.controller");
const router = require("express").Router();

// auth routes
router.post("/register", register)
router.get("/login", login)

module.exports = router