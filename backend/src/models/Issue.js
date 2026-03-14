const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  citizenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true, // we will use Base64 MVP
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  category: {
    type: String, // Kept for reference but department handles routing
    required: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  assignedWorkerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    default: null, // assigned later via algorithm
  },
  status: {
    type: String,
    enum: ["Submitted", "Assigned", "InProgress", "Resolved", "Closed"],
    default: "Submitted",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  completionImageUrl: {
    type: String, // proof-of-completion Base64 image
    default: null
  }
}, { timestamps: true });

// Geo index for finding nearby issues
issueSchema.index({ "location.lat": 1, "location.lng": 1 });
// Department index for quick queries
issueSchema.index({ departmentId: 1 });

module.exports = mongoose.model("Issue", issueSchema);
