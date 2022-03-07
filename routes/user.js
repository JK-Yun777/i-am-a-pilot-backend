const express = require("express");
const router = express.Router();

const UserController = require("./controllers/User.Controller");

router.post("/distance", UserController.addDistance);
router.get("/rank", UserController.getRankList);

module.exports = router;
