const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const workspaceController = require("../controllers/workspaceController");

router.use(authMiddleware);
// Routes for workspace management
router.post("/create", workspaceController.createWorkspace);
router.get("/getAll", workspaceController.getAllWorkspaces);
router.get("/:workspaceId", workspaceController.getWorkspaceById);
router.put("/:workspaceId", workspaceController.updateWorkspace);
router.delete("/:workspaceId", workspaceController.deleteWorkspace);

module.exports = router;