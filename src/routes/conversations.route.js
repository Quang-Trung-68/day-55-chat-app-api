const express = require("express");
const router = express.Router();
const conversationController = require("@/controllers/conversation.controller");
const authRequired = require("@/middlewares/authRequired");

router.get("/", authRequired, conversationController.getConversations);
router.get("/:id", authRequired, conversationController.getConversation);
router.get(
  "/:id/users",
  authRequired,
  conversationController.getConversationUser,
);
router.post("/", authRequired, conversationController.create);
router.get("/:id/messages", authRequired, conversationController.getMessages);
router.get(
  "/:id/latest-message",
  authRequired,
  conversationController.getLatestMessage,
);
router.post(
  "/:id/messages",
  authRequired,
  conversationController.createMessage,
);

module.exports = router;
