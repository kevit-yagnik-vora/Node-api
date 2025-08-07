const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const messageController = require("../controllers/messageController");

router.use(authMiddleware);
router.post("/addMessage", messageController.createMessage);
router.get("/getAll", messageController.getAllMessages);
router.get("/:messageId", messageController.getMessageById);
router.put("/:messageId", messageController.updateMessage);
router.delete("/:messageId", messageController.deleteMessage);

module.exports = router;