const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login user
// Login user // Adjust the path as needed

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" }); // Use 401 for Unauthorized
    }

    // Verify the password (assuming you're using bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" }); // Use 401 for invalid credentials
    }

    // Create JWT token and include username
    const token = jwt.sign(
      { id: user._id, username: user.username }, // Include username here
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token }); // Send both message and token
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Export only the router by default and the authenticateToken separately
module.exports = { router, authenticateToken };
