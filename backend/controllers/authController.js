const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    req.session.isLoggedIn = true;
    req.session.user = {
      _id: user._id.toString(),
      email: user.email,
    };

    req.session.save((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Session save failed" });
      }

      res.status(200).json({
        message: "Logged in",
        email: user.email,
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("connect.sid");

    res.status(200).json({ message: "Logged out" });
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { firstName, secondName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstName,
      secondName,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "User created",
      user: {
        _id: savedUser._id,
        email: savedUser.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.isAuth = (req, res, next) => {
  if (!req.session || !req.session.isLoggedIn) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
};