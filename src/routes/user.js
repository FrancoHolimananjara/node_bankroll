const userRoutes = require("express").Router();
const { profile, deleteAccount } = require("../controllers/user");
const { authMiddleware } = require("../middleware/auth");

userRoutes.get("/profile", authMiddleware, profile);
userRoutes.delete("/delete-my-account", authMiddleware, deleteAccount);

module.exports = userRoutes;
