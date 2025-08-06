// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },

    workspaces: {
      type: [
        {
          workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
          },
          role: { type: String, enum: ["Editor", "Viewer"], required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true, // ✅ Auto-manages createdAt and updatedAt
  }
);

userSchema.index({ email: 1 }); // already unique

module.exports = mongoose.model("User", userSchema);
