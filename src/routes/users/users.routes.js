const express = require("express");
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../../middlewares/isAuthenticated");

const prisma = new PrismaClient();
const router = express.Router();

// Perfil do usuário logado
router.get("/me", isAuthenticated, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      profile: true,
    },
  });

  res.json(user);
});

router.put("/me/profile", isAuthenticated, async (req, res) => {
  const { bio, profileImageUrl } = req.body;

  const profile = await prisma.profile.update({
    where: { userId: req.user.id },
    data: {
      bio,
      profileImageUrl,
    },
  });

  res.json(profile);
});

module.exports = router;