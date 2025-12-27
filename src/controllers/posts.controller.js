const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getFeed = async (req, res) => {
  const userId = req.user.id;

  try {
    // Pega IDs de usuários que o logado segue com status ACCEPTED
    const followedUsers = await prisma.follow.findMany({
      where: {
        followerId: userId,
        status: "ACCEPTED",
      },
      select: { followingId: true },
    });

    const followingIds = followedUsers.map(f => f.followingId);

    // Inclui o próprio usuário
    followingIds.push(userId);

    // Busca posts do feed
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: followingIds },
      },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profile: true,
          },
        },
        // Preparado para comentários (ainda não existe model)
        comments: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
            createdAt: true,
          },
        },
        // Preparado para likes (ainda não existe model)
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar feed" });
  }
};

module.exports = { getFeed };