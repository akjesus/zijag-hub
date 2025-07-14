// controllers/authController.js
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let blacklistedTokens = new Set(); // Store invalid tokens (only works for in-memory)
const SECRET_KEY = "your_secret_key"; // Store in env file

exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
  
      const user = await User.findOne({username});
  
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // Ensure password from DB is not null
      if (!user.password) {
        return res.status(500).json({ error: "User record is corrupted. No password found." });
      }
      // Verify password against hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, SECRET_KEY, { expiresIn: "24h" });
  
      res.json({ message: "Login successful", token });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: err.message });
    }
  };


exports.createUser= async (req, res) => {
    try {
      const { firstName, lastName, email, username, password } = req.body;
  
      if (!username ||!password) {
        return res.status(400).json({ error: "Invalid Data" });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const user=  new User({
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role: "User" // Default role for initial setup
      });
      const result = await user.save();
      if (!result) {
        return res.status(500).json({ error: "Failed to create user" });
      }
      res.status(201).json({ message: "User created successfully", result});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

exports.logout = (req, res) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
          blacklistedTokens.add(token); // Add token to blacklist
      }
      res.json({ message: "Logout successful" });
  };

  
exports.verifyToken = async (req, res, next) => {
      const token = req.headers.authorization?.split(" ")[1];
      
      if (!token) {
          return res.status(401).json({ error: "Unauthorized or logged out" });         
      }
      jwt.verify(token, "your_secret_key", (err, user) => {
          if (err) {
              return res.status(403).json({ error: "Invalid token" });
          }
        req.user = user;
          next();
      });
  };

exports.makeAdmin = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id)
      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      user.role = "Admin"; // Change role to Admin
      await user.save();
  
      res.json({ message: "User role updated to Admin", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  }

//get all users
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}, "-password"); // Exclude password field
      const result = users.map((item, index) => ({
        serialNumber: index + 1,
        ...item.toObject(),
      }));
      return res.status(200).json(result);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: err.message });
    }
  };

