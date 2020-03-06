const express = require("express");
const router = express.Router();

const UserController = require('../controllers/users')

router.post("/signup", UserController.users_signup);

router.post("/login", UserController.users_login);

router.delete("/:userId", UserController.users_delete);

module.exports = router;
