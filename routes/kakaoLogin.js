const express = require("express");
const router = express.Router();

const UserController = require("./controllers/User.Controller");

router.post("/", UserController.createUser);

module.exports = router;
