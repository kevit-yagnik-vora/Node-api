const Workspace = require("../models/workspaceModel");

const createWorkspace = (req, res) => {
  console.log(req.user);
  const workspace = new Workspace({
    name: req.body.name,
    createdBy: req.user.userId,
  });

  workspace
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Workspace created successfully",
        workspace: result,
        request: {
          type: "GET",
          url: "http://localhost:3000/workspaces/" + result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const getAllWorkspaces = (req, res) => {
  Workspace.find()
    .then((workspaces) => {
      res.status(200).json({ data: workspaces });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const getWorkspaceById = (req, res) => {
  const workspaceId = req.params.workspaceId;
  Workspace.findById(workspaceId)
    .then((workspace) => {
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }
      res.status(200).json({ data: workspace });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const updateWorkspace = (req, res) => {
  const workspaceId = req.params.workspaceId;
  const updatedData = req.body;

  Workspace.findByIdAndUpdate(workspaceId, updatedData)
    .then((workspace) => {
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }
      res.status(200).json({ message: "Workspace updated successfully", data: req.body });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });

};

const deleteWorkspace = (req, res) => {
  const workspaceId = req.params.workspaceId;
  Workspace.findByIdAndDelete(workspaceId)
    .then((workspace) => {
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }
      res.status(200).json({ message: "Workspace deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

module.exports = {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
