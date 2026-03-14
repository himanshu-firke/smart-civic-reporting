const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  serviceRadiusKm: {
    type: Number,
    required: true,
    min: 0.1
  }
}, { timestamps: true });

// Prevent duplicate worker profiles for the same user
workerSchema.index({ userId: 1 }, { unique: true });
// Geospatial index for faster location queries on issues later
workerSchema.index({ "location.lat": 1, "location.lng": 1 });

module.exports = mongoose.model("Worker", workerSchema);
