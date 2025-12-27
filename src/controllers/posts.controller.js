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
            createdAt: true,
            author: { select: { id: true, username: true } },
          },
        },
        // Preparado para likes (ainda não existe model)
        likes: {
          select: { id: true, userId: true },
        },
      },
    });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar feed" });
  }
};

// Função para criar comentário
const addComment = async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.id);
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Comentário não pode ser vazio" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, username: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar comentário" });
  }
};

// Função para curtir post
const addLike = async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.id);

  try {
    // Evita curtir duas vezes
    const existingLike = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existingLike) {
      return res.status(400).json({ message: "Você já curtiu este post" });
    }

    const like = await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    res.status(201).json(like);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao curtir post" });
  }
};

module.exports = { getFeed, addComment, addLike };