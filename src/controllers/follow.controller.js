const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const followUser = async (req, res) => {
  const followerId = req.user.id;
  const followingId = parseInt(req.params.id);

  if (followerId === followingId) {
    return res.status(400).json({ message: "Não é possível seguir a si mesmo" });
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  if (existingFollow) {
    return res.status(400).json({ message: "Já existe um pedido de follow" });
  }

  await prisma.follow.create({
    data: {
      followerId,
      followingId,
      status: "PENDING",
    },
  });

  res.json({ message: "Pedido de follow enviado" });
};

const acceptFollow = async (req, res) => {
  const followingId = req.user.id; // quem está aceitando
  const followerId = parseInt(req.params.id);

  const followRequest = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (!followRequest) {
    return res.status(404).json({ message: "Pedido de follow não encontrado" });
  }

  await prisma.follow.update({
    where: { followerId_followingId: { followerId, followingId } },
    data: { status: "ACCEPTED" },
  });

  res.json({ message: "Follow aceito" });
};

module.exports = { followUser, acceptFollow };