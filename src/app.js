require("dotenv").config();
const express = require("express");
const sessionMiddleware = require("./config/session");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth/auth.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Odin-Book API funcionando 🚀");
});

module.exports = app;