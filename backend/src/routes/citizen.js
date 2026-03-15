const express = require("express");
const Issue = require("../models/Issue");
const Notification = require("../models/Notification");
const { authMiddleware } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

const citizenRouter = express.Router();

citizenRouter.use(authMiddleware);
citizenRouter.use(requireRole("Citizen"));

// GET /api/citizen/issues - Get all issues reported by this citizen
citizenRouter.get("/issues", async (req, res) => {
  try {
    const citizenId = req.user.userId;

    const myIssues = await Issue.find({ citizenId })
      .populate("departmentId", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ issues: myIssues });

  } catch (error) {
    console.error("Citizen GET Issues Error:", error);
    res.status(500).json({ message: "Internal server error fetching your issues." });
  }
});

// GET /api/citizen/notifications - Get all notifications for the citizen
citizenRouter.get("/notifications", async (req, res) => {
  try {
    const citizenId = req.user.userId;
    const notifications = await Notification.find({ citizenId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({ notifications });
  } catch (error) {
    console.error("Fetch Notifications Error:", error);
    res.status(500).json({ message: "Internal server error fetching your notifications." });
  }
});

// PUT /api/citizen/notifications/:id/read - Mark a notification as read
citizenRouter.put("/notifications/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const citizenId = req.user.userId;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, citizenId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json({ message: "Notification marked as read.", notification });
  } catch (error) {
    console.error("Mark Notification Read Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = { citizenRouter };
