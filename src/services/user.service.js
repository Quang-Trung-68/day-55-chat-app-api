const prisma = require("@/libs/prisma");

class UserService {
    async getAll() {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                score: true,
                posts_count: true,
                email_verified_at: true,
                created_at: true,
            },
        });
        return users;
    }

    async searchUsers(query, currentUserId) {
        return prisma.user.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                name: {
                                    contains: query,
                                },
                            },
                            {
                                email: {
                                    contains: query,
                                },
                            },
                        ],
                    },
                    ...(currentUserId ? [{ id: { not: currentUserId } }] : []),
                ],
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
            take: 5,
        });
    }

    async getDetail(id) {
        return prisma.user.findUniqueOrThrow({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                name: true,
                score: true,
                posts_count: true,
                email_verified_at: true,
                created_at: true,
                updated_at: true,
                posts: true,
            },
        });
    }
}

module.exports = new UserService();
