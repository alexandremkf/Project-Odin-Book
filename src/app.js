require("dotenv").config();
const express = require("express");

// Config imports
const sessionMiddleware = require("./config/session");
const passport = require("./config/passport");

// Routes imports
const authRoutes = require("./routes/auth/auth.routes");
const userRoutes = require("./routes/users/users.routes");
const postRoutes = require("./routes/posts/posts.routes");
const protectedRoutes = require("./routes/protected/protected.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session and Passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/protected", protectedRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Odin-Book API funcionando 🚀");
});

module.exports = app;