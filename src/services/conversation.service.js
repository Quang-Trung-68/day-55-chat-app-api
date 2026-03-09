const prisma = require("@/libs/prisma");
const pusher = require("@/libs/pusher");
const { PrismaClient } = require("@root/generated/prisma");

class ConversationService {
  async create(name, type, userIds) {
    if (type === "dm") {
      // Check exiting conversation
      const records = await prisma.conversationUser.groupBy({
        by: ["conversation_id"],
        where: {
          user_id: { in: userIds },
        },
        _count: {
          user_id: true,
        },
        having: {
          user_id: {
            _count: {
              equals: userIds.length,
            },
          },
        },
      });
      if (records.length === 1) {
        // return exiting conversation
        const { conversation_id: conversationId } = records[0];
        const conversation = await prisma.conversation.findFirstOrThrow({
          where: {
            id: conversationId,
          },
        });
        return conversation;
      } else {
        // create new conversation
        const conversation = await prisma.conversation.create({
          data: {
            name: name || null,
            type,
          },
        });

        for (const userId of userIds) {
          await prisma.conversationUser.create({
            data: {
              conversation_id: conversation.id,
              user_id: userId,
            },
          });
        }

        return conversation;
      }
    }
  }

  async getConversation(conversationId) {
    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: {
        id: conversationId,
      },
    });
    return conversation;
  }

  async getConversationUser(conversationId) {
    const conversationUser = await prisma.conversationUser.findMany({
      where: {
        conversation_id: conversationId,
      },
    });
    return conversationUser;
  }

  async getMessages(conversationId, limit, before) {
    const messages = await prisma.message.findMany({
      where: {
        conversation_id: conversationId,
        ...(before && {
          id: {
            lt: before,
          },
        }),
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit + 1,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
    let hasMore = false;
    if (messages.length > limit) {
      hasMore = true;
      messages.pop();
    }
    messages.reverse();
    const nextCursor = messages[0]?.id;
    return {
      messages,
      pagination: {
        hasMore,
        nextCursor: hasMore ? nextCursor : null,
      },
    };
  }

  async getLatestMessage(conversationId) {
    const message = await prisma.message.findFirst({
      where: {
        conversation_id: conversationId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 1,
    });
    return message;
  }

  async createMessage(conversationId, userId, type, content) {
    await prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
    });

    const message = await prisma.message.create({
      data: {
        user_id: userId,
        conversation_id: conversationId,
        type: type || "text",
        content,
      },
    });

    const response = await pusher.trigger(
      `conversation-${conversationId}`,
      "created",
      message,
    );
    console.log("trigger 1 message.", response);

    return message;
  }

  async getConversations(userId) {
    const conversations = await prisma.conversationUser.findMany({
      where: {
        user_id: userId,
      },
      include: {
        conversation: {
          include: {
            messages: {
              orderBy: {
                created_at: "desc",
              },
              take: 1,
              select: {
                id: true,
                content: true,
                created_at: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            conversationUsers: {
              where: {
                NOT: {
                  user_id: userId,
                },
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return conversations;
  }

  async checkUserInConversation(userId, conversationId) {
    const result = await prisma.conversationUser.findFirst({
      where: {
        conversation_id: conversationId,
        user_id: userId,
      },
    });
    return result || null;
  }
}

module.exports = new ConversationService();
