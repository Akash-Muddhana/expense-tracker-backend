const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");

// ✅ LOGIN
authRouter.post("/login", authController.postLogin);

// ✅ AUTH CHECK
authRouter.get("/auth-check", authController.isAuth, (req, res) => {
  res.status(200).json({ isLoggedIn: true });
});

// ❗ FIXED: route naming (lowercase, consistent)
authRouter.post("/logout", authController.postLogout);

// ✅ SIGNUP
authRouter.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("enter a valid email"),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("enter a password of about 4 characters"),
  ],
  authController.postSignup
);

module.exports = authRouter;