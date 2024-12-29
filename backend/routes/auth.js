const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
// Login user // Adjust the path as needed

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
   console.log("Plain password provided:", password);
   console.log("Hashed password in DB:", user.password);

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return res.status(500).json({ message: "Server error" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET, // Ensure this has a value
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
const testPasswordComparison = async () => {
  const plainPassword = "Prathishaditi@2930";
  const hashedPassword =
    "$2a$10$JcoIKK0cECmtOyOKazTjcO4D8OgfdPoI1bQL.YM3OwKpCqle8hyAi";

  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("Password Match:", isValid);
};

testPasswordComparison();
router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token required" });
  }

  try {
    // Verify refresh token
    const verified = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Create a new access token
    const accessToken = jwt.sign(
      { id: verified.id, username: verified.username },
      process.env.JWT_SECRET,
     
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});
// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Received token:", token);
   
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
     console.log("Verified token payload:", verified);
    req.user = verified;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    res.status(403).json({ message: "Invalid token" });
  }
};


// Export only the router by default and the authenticateToken separately
module.exports = { router, authenticateToken };
