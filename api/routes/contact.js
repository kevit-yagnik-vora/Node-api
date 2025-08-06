const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const contactController = require("../controllers/contactController");

router.use(authMiddleware);
router.post("/", contactController.createContact);
router.get("/", contactController.getAllContacts);
router.get("/:contactId", contactController.getContactById);
router.put("/:contactId", contactController.updateContact);
router.delete("/:contactId", contactController.deleteContact);

module.exports = router;