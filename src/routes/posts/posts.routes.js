const express = require("express");
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const { getFeed, addComment, addLike } = require("../../controllers/posts.controller");

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

// Feed personalizado
router.get("/", isAuthenticated, getFeed);

// Comentário
router.post("/:id/comment", isAuthenticated, addComment);

// Curtir post
router.post("/:id/like", isAuthenticated, addLike);

module.exports = router;