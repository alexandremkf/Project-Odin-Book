const express = require("express");
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const { getFeed } = require("../../controllers/posts.controller");

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
// Feed personalizado (posts do próprio usuário + usuários seguidos)
router.get("/", isAuthenticated, getFeed);

module.exports = router;