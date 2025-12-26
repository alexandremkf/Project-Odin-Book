const express = require("express");
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../../middlewares/isAuthenticated");

const prisma = new PrismaClient();
const router = express.Router();

// Criar post
router.post("/", isAuthenticated, async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Conteúdo não pode ser vazio" });
  }

  const post = await prisma.post.create({
    data: {
      content,
      authorId: req.user.id,
    },
  });

  res.status(201).json(post);
});

// Listar posts do usuário logado (feed inicial simples)
router.get("/", isAuthenticated, async (req, res) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: req.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  res.json(posts);
});

module.exports = router;