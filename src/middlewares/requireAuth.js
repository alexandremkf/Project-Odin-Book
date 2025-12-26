const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Você precisa estar logado para acessar este recurso" });
  }
  next(); // MUITO IMPORTANTE: chama o próximo middleware ou handler
};

module.exports = requireAuth;