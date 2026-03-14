const express = require("express");
const Issue = require("../models/Issue");
const User = require("../models/User");
const Department = require("../models/Department");
const bcrypt = require("bcryptjs");
const { authMiddleware } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

const adminRouter = express.Router();

adminRouter.use(authMiddleware);
adminRouter.use(requireRole("SuperAdmin"));

// GET /api/admin/users - List all users excluding their password hashes
adminRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").populate("departmentId", "name").lean();
    res.json({ users });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// POST /api/admin/department-admins - Admin creates a Department Admin manually mapped to a Department
adminRouter.post("/department-admins", async (req, res) => {
  try {
    const { name, email, password, departmentId } = req.body;
    
    if (!name || !email || !password || !departmentId) {
      return res.status(400).json({ message: "All fields are required to register a Dept Admin." });
    }

    const deptExists = await Department.findById(departmentId);
    if (!deptExists) {
      return res.status(404).json({ message: "Assigned Department does not exist." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name,
      email,
      passwordHash,
      role: "Department Admin",
      departmentId
    });

    await newAdmin.save();

    res.status(201).json({ 
      message: "Department Admin registered successfully.",
      user: { id: newAdmin._id, name, email, role: newAdmin.role, departmentId }
    });
  } catch (error) {
    console.error("Create Dept Admin Error:", error);
    res.status(500).json({ message: "Server error creating department admin." });
  }
});

// GET /api/admin/analytics - Aggregated system metrics
adminRouter.get("/analytics", async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    
    // Aggregate issues by status
    const statusCounts = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Format into a clean object instead of an array of objects
    const byStatus = {
      Submitted: 0,
      Assigned: 0,
      InProgress: 0,
      Resolved: 0,
      Closed: 0
    };

    statusCounts.forEach(item => {
      // Map the DB enum to our tracker keys if needed, assuming direct match for now
      if (byStatus[item._id] !== undefined) {
        byStatus[item._id] = item.count;
      } else {
        // Fallback for loosely typed statuses mapping
        byStatus[item._id] = item.count;
      }
    });

    res.json({
      metrics: {
        totalIssues,
        byStatus
      }
    });
  } catch (error) {
    console.error("Admin Analytics Error:", error);
    res.status(500).json({ message: "Internal server error fetching analytics." });
  }
});

// GET /api/admin/reports/issues - A global dump of all issues across all departments
adminRouter.get("/reports/issues", async (req, res) => {
  try {
    const allIssues = await Issue.find()
      .populate("departmentId", "name")
      .populate("citizenId", "name email")
      .populate("assignedWorkerId", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ issues: allIssues });
  } catch (error) {
    console.error("Admin Reports Error:", error);
    res.status(500).json({ message: "Internal server error fetching system reports." });
  }
});

module.exports = { adminRouter };
