const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        profile: {
          create: {},
        },
      },
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post(
  "/login",
  passport.authenticate("local"),
  (req, res) => {
    res.json({ message: "Login realizado com sucesso" });
  }
);

// Logout
router.post("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: "Logout realizado" });
  });
});

module.exports = router;