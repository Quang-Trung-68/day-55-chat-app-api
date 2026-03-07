const conversationService = require("@/services/conversation.service");
const { http } = require("@/configs/constants");

const create = async (req, res) => {
  const { name, type, user_ids } = req.body;
  const userIds = [req.auth.user.id, ...(user_ids || [])];

  const conversation = await conversationService.create(name, type, userIds);

  res.success(conversation, http.created);
};

const getMessages = async (req, res) => {
  const conversationId = parseInt(req.params.id);
  const userId = req.auth.user.id;
  const result = await conversationService.checkUserInConversation(
    userId,
    conversationId,
  );
  if (result) {
    const messages = await conversationService.getMessages(conversationId);
    res.success(messages);
  } else {
    res.error("Can not get messages", http.forbidden);
  }
};

const createMessage = async (req, res) => {
  const { type, content } = req.body;
  const conversationId = parseInt(req.params.id);
  const userId = req.auth.user.id;

  const result = await conversationService.checkUserInConversation(
    userId,
    conversationId,
  );

  if (result) {
    const message = await conversationService.createMessage(
      conversationId,
      userId,
      type,
      content,
    );

    res.success(message, http.created);
  } else {
    res.error("Can not create messages", http.forbidden);
  }
};

const getConversations = async (req, res) => {
  const result = await conversationService.getConversations(req.auth.user.id);
  return res.success(result);
};

module.exports = {
  create,
  getMessages,
  createMessage,
  getConversations,
};
