const express = require("express");
const Issue = require("../models/Issue");
const Worker = require("../models/Worker");
const Notification = require("../models/Notification");
const { authMiddleware } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const { uploadBase64Image } = require("../utils/cloudinary");

const workerRouter = express.Router();

workerRouter.use(authMiddleware);
workerRouter.use(requireRole("Worker"));

// GET /api/worker/issues - Get all issues assigned to this worker
workerRouter.get("/issues", async (req, res) => {
  try {
    const workerId = req.user.userId;

    // We must find the actual Worker document to get its _id so we can match it against Issue's assignedWorkerId
    const workerProfile = await Worker.findOne({ userId: workerId });

    if (!workerProfile) {
      return res.status(404).json({ message: "Worker profile not found" });
    }

    const assignedIssues = await Issue.find({ assignedWorkerId: workerProfile._id })
      .populate("departmentId", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ issues: assignedIssues });

  } catch (error) {
    console.error("Worker GET Issues Error:", error);
    res.status(500).json({ message: "Internal server error fetching worker issues." });
  }
});

// PUT /api/worker/issues/:id/status - Update issue status + attach proof
workerRouter.put("/issues/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completionImageUrl } = req.body;
    const workerId = req.user.userId;

    const workerProfile = await Worker.findOne({ userId: workerId });
    if (!workerProfile) {
       return res.status(404).json({ message: "Worker profile not found." });
    }

    // Ensure state transitions are valid
    const validStatuses = ["In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
       return res.status(400).json({ message: "Invalid status transition requested." });
    }

    if (status === "Resolved" && (!completionImageUrl || completionImageUrl.trim() === "")) {
      return res.status(400).json({ message: "Proof of completion photo is required to mark an issue as Resolved." });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
       return res.status(404).json({ message: "Issue not found." });
    }

    // Verify Ownership
    if (String(issue.assignedWorkerId) !== String(workerProfile._id)) {
       return res.status(403).json({ message: "You are not authorized to update this issue." });
    }

    issue.status = status;
    if (status === "Resolved") {
       // Convert "In Progress" back to string without space for enum, or handle enum loosely here depending on mapping.
       // The DB enum says: ["Submitted", "Assigned", "InProgress", "Resolved"]
       issue.status = "Resolved";
       
       // Handle Cloudinary Upload for Workers
       let secureCompletionImage = completionImageUrl;
       if (completionImageUrl && completionImageUrl.startsWith("data:image")) {
         try {
           secureCompletionImage = await uploadBase64Image(completionImageUrl, "civic/proofs");
         } catch (uploadErr) {
           return res.status(500).json({ message: "Failed to upload proof image." });
         }
       }
       issue.completionImageUrl = secureCompletionImage;

    } else if (status === "In Progress") {
       issue.status = "InProgress";
    }

    await issue.save();

    // Dispatch Notification based on the new status
    let notificationMessage = "";
    if (status === "In Progress") {
       notificationMessage = "Work has begun on your reported issue.";
    } else if (status === "Resolved") {
       notificationMessage = "A field worker has resolved your issue and uploaded proof. It's pending final verify.";
    }

    if (notificationMessage) {
      await Notification.create({
        citizenId: issue.citizenId,
        issueId: issue._id,
        message: notificationMessage
      });
    }

    res.json({
       message: "Issue status updated successfully.",
       issue: {
         id: issue._id,
         status: issue.status,
         completionImageUrl: issue.completionImageUrl
       }
    });

  } catch (error) {
    console.error("Worker Update Issue Error:", error);
    res.status(500).json({ message: "Internal server error updating issue status." });
  }
});

module.exports = { workerRouter };
