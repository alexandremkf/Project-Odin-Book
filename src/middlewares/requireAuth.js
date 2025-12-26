function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      error: "Você precisa estar logado para acessar este recurso",
    });
  }

  next();
}

module.exports = { requireAuth };