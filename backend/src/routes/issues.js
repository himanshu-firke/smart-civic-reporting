const express = require("express");
const Issue = require("../models/Issue");
const Department = require("../models/Department");
const Worker = require("../models/Worker");
const Notification = require("../models/Notification");
const { authMiddleware } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const { autoAssignWorker } = require("../services/assignmentService");
const { uploadBase64Image } = require("../utils/cloudinary");

const issuesRouter = express.Router();

// All endpoins are secure
issuesRouter.use(authMiddleware);

// POST /api/issues - Citizens only 
issuesRouter.post("/", requireRole("Citizen"), async (req, res) => {
  try {
    const { description, imageUrl, location, departmentId, category } = req.body;
    const citizenId = req.user.userId; // User ID from decoded JWT

    // 1. Validate Input
    if (!description || !imageUrl || !location || location.lat == null || location.lng == null || !departmentId || !category) {
      return res.status(400).json({ message: "Description, base64 image, location, department, and category are required." });
    }

    // 2. Validate department exists
    const deptExists = await Department.findById(departmentId);
    if (!deptExists) {
      return res.status(404).json({ message: "Invalid department selected." });
    }

    // 3. Create the issue report
    // Upload Base64 image string to Cloudinary
    let secureImageUrl = imageUrl;
    if (imageUrl && imageUrl.startsWith("data:image")) {
      try {
        secureImageUrl = await uploadBase64Image(imageUrl, "civic/reports");
      } catch (uploadErr) {
        return res.status(500).json({ message: "Failed to upload image. Please try again." });
      }
    }

    const newIssue = new Issue({
      citizenId,
      description,
      imageUrl: secureImageUrl,
      location: { lat: Number(location.lat), lng: Number(location.lng) },
      category,
      departmentId,
      status: "Submitted",
      assignedWorkerId: null // Worker assigned later
    });

    await newIssue.save();

    // 4. Trigger the Module 9 geospatial auto-assignment engine asynchronously!
    // We execute this and wait for it so the UI explicitly knows if it was Assigned instantly.
    const assignedIssue = await autoAssignWorker(newIssue._id);

    res.status(201).json({
      message: "Issue reported successfully",
      issue: {
        id: assignedIssue._id,
        status: assignedIssue.status,
        departmentId: assignedIssue.departmentId,
        assignedWorkerId: assignedIssue.assignedWorkerId
      }
    });

  } catch (error) {
    console.error("Create Issue Error:", error);
    res.status(500).json({ message: "Internal server error submitting issue." });
  }
});

// PUT /api/issues/:id/reassign - Admins only
issuesRouter.put("/:id/reassign", requireRole(["SuperAdmin", "DepartmentAdmin"]), async (req, res) => {
  try {
    const { assignedWorkerId } = req.body;
    const { id } = req.params;

    if (!assignedWorkerId) {
      return res.status(400).json({ message: "worker ID required for reassignment." });
    }

    // Verify worker exists
    const workerExists = await Worker.findById(assignedWorkerId);
    if (!workerExists) {
      return res.status(404).json({ message: "Target worker does not exist." });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
       return res.status(404).json({ message: "Issue not found." });
    }

    // Assign worker
    issue.assignedWorkerId = assignedWorkerId;
    issue.status = "Assigned";
    await issue.save();

    // Dispatch Notification
    await Notification.create({
      citizenId: issue.citizenId,
      issueId: issue._id,
      message: "An Administrator has manually reassigned your issue to a specialized field worker."
    });

    res.json({
       message: "Issue successfully reassigned.",
       issue: {
         id: issue._id,
         assignedWorkerId: issue.assignedWorkerId,
         status: issue.status
       }
    });
  } catch (error) {
    console.error("Reassign Issue Error:", error);
    res.status(500).json({ message: "Failed to manually reassign worker." });
  }
});

module.exports = { issuesRouter };
