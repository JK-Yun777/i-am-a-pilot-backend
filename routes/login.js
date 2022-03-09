const express = require("express");
const router = express.Router();

const UserController = require("./controllers/User.Controller");

router.post("/kakao", UserController.createUserForKakao);
router.post("/google", UserController.createUserForGoogle);

module.exports = router;
