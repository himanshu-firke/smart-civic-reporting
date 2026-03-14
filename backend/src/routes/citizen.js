const express = require("express");
const Issue = require("../models/Issue");
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

module.exports = { citizenRouter };
