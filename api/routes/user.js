const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/addUser", userController.addUser);
router.post("/login", userController.userLogin);
router.get("/getAll",authMiddleware, userController.getAllUsers);
router.get("/:userId",authMiddleware, userController.getUserById);
router.put("/:userId",authMiddleware, userController.updateUser);
router.delete("/:userId", authMiddleware, userController.deleteUser);
router.post("/logout", authMiddleware, userController.userLogout);
// router.get("/:userId/workspaces", userController.getUserWorkspaces);


module.exports = router;
