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
    const limit = parseInt(req.query.limit) || 20;
    const before = req.query.before ? parseInt(req.query.before) : null;
    const messages = await conversationService.getMessages(
      conversationId,
      limit,
      before,
    );
    res.success(messages);
  } else {
    res.error("Can not get messages", http.forbidden);
  }
};

const getLatestMessage = async (req, res) => {
  const conversationId = parseInt(req.params.id);
  const userId = req.auth.user.id;

  const result = await conversationService.checkUserInConversation(
    userId,
    conversationId,
  );

  if (result) {
    const message = await conversationService.getLatestMessage(conversationId);
    return res.success(message);
  } else {
    return res.error("Can not get latest message", http.forbidden);
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

const getConversation = async (req, res) => {
  const result = await conversationService.getConversation(
    parseInt(req.params.id),
  );
  return res.success(result);
};

const getConversationUser = async (req, res) => {
  const result = await conversationService.getConversationUser(
    parseInt(req.params.id),
  );
  return res.success(result);
};

module.exports = {
  create,
  getMessages,
  createMessage,
  getLatestMessage,
  getConversations,
  getConversation,
  getConversationUser,
};
