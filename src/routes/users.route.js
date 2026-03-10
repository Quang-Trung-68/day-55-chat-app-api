const express = require("express");
const router = express.Router();
const userController = require("@/controllers/user.controller");
const authRequired = require("@/middlewares/authRequired");

router.get("/search", authRequired, userController.searchUsers);
router.get("/", userController.getAll);
router.get("/:id", userController.getDetail);

module.exports = router;
