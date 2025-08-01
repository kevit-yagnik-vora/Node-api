const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/blacklistedTockenModel");

exports.getAllUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({ data: users });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.addUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  } else {
    bcrypt.hash(req.body.passwordHash, 8, async (err, hash) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      } else {
        const users = await User.find({ phoneNumber: req.body.phoneNumber });
        if (users.length > 0) {
          return res
            .status(400)
            .json({ message: "Phone number already exists" });
        }

        const userList = await User.find();

        // Create a new user
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          passwordHash: hash,
          isAdmin: userList.length === 0 ? true : req.body.isAdmin || false, // First user is admin
          workspaces: req.body.workspaces || [],
        });
        user
          .save()
          .then((result) => {
            res.status(201).json({
              message: "User created successfully",
              user: result,
            });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      }
    });
  }
};

exports.userLogin = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      bcrypt.compare(
        req.body.passwordHash,
        user.passwordHash,
        (err, isMatch) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
          }
          const token = jwt.sign(
            {
              userId: user._id,
              email: user.email,
              name: user.name,
              isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          res.status(200).json({
            message: "Login successful",
            token: token,
          });
        }
      );
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: "User retrieved successfully", data: user });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.updateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, req.body)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: "User updated successfully", data: req.body });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.getUserWorkspaces = (req, res) => {
  User.findById(req.params.userId)
    .populate("workspaces")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ data: user.workspaces });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.userLogout = async (req, res) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Token not provided" });
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    // Save token to blacklist
    const expiresAt = new Date(decoded.exp * 1000); // JWT exp is in seconds
    await BlacklistedToken.create({ token, expiresAt });

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
