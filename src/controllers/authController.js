const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const register = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;

    const exists = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (exists) {
      return res.status(409).json({ error: "Email or username already taken" });
    }

    const hash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hash,
      bio
    });

    res.status(201).json({
      token: signToken(user._id),
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      token: signToken(user._id),
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const me = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, me };