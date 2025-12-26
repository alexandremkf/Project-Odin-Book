const express = require("express");
const { requireAuth } = require("../../middlewares/requireAuth");

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  res.json({
    message: "Acesso autorizado ✅",
    user: req.user,
  });
});

module.exports = router;