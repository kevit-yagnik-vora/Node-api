const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
