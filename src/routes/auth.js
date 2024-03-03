const authRoutes = require("express").Router();
const { register, login, verifyOtp } = require("../controllers/auth");

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/verify/:_id", verifyOtp);

module.exports = authRoutes;
