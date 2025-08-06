// models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    tags: [{ type: String }],
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // ✅ Auto-manages createdAt and updatedAt
  }
);

// Indexes
contactSchema.index({ workspaceId: 1, phoneNumber: 1 });
contactSchema.index({ workspaceId: 1, tags: 1 });

module.exports = mongoose.model("Contact", contactSchema);
