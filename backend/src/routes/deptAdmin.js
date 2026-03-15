const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Department = require("../models/Department");
const Worker = require("../models/Worker");
const Issue = require("../models/Issue");
const { authMiddleware } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

const deptAdminRouter = express.Router();

// Only Department Admins can manage workers
deptAdminRouter.use(authMiddleware);
deptAdminRouter.use(requireRole("DepartmentAdmin"));

// GET /api/dept-admin/workers - Fetch all workers within context of the current admin's department
deptAdminRouter.get("/workers", async (req, res) => {
  try {
    const departmentId = req.user.departmentId;

    if (!departmentId) {
      return res.status(403).json({ message: "Admin is missing a department assignment." });
    }

    // Find all worker profiles for this department
    const workerProfiles = await Worker.find({ departmentId })
      .populate("userId", "name email role")
      .lean();

    // Transform output mapping back up to standard specs
    const workers = workerProfiles.map(wp => {
      // Safely protect against orphaned workers if user was deleted raw
      if (!wp.userId) return null;
      
      return {
        id: wp._id,
        userId: wp.userId._id,
        name: wp.userId.name,
        email: wp.userId.email,
        location: wp.location,
        serviceRadiusKm: wp.serviceRadiusKm,
        createdAt: wp.createdAt
      };
    }).filter(w => w !== null);

    res.json({ workers });
  } catch (error) {
    console.error("Fetch Workers Error:", error);
    res.status(500).json({ message: "Internal server error fetching workers." });
  }
});

// POST /api/dept-admin/workers - Register a new worker to the active admin's department
deptAdminRouter.post("/workers", async (req, res) => {
  try {
    const { name, email, password, location, serviceRadiusKm } = req.body;
    const departmentId = req.user.departmentId;

    if (!departmentId) {
      return res.status(403).json({ message: "Admin is missing a department assignment." });
    }

    if (!name || !email || !password || !location || location.lat == null || location.lng == null || serviceRadiusKm == null) {
      return res.status(400).json({ message: "Name, email, password, lat, lng, and service radius required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "Worker",
      departmentId: departmentId
    });

    await user.save();

    const workerProfile = new Worker({
      userId: user._id,
      departmentId: departmentId,
      location: { lat: Number(location.lat), lng: Number(location.lng) },
      serviceRadiusKm: Number(serviceRadiusKm)
    });

    await workerProfile.save();

    res.status(201).json({
      message: "Worker created successfully",
      worker: {
        id: workerProfile._id,
        userId: user._id,
        name: user.name,
        email: user.email,
        location: workerProfile.location,
        serviceRadiusKm: workerProfile.serviceRadiusKm
      }
    });
  } catch (error) {
    console.error("Create Worker Error:", error);
    res.status(500).json({ message: "Internal server error creating worker" });
  }
});

// ----------------------------------------------------
// MODULE 11: ISSUE OPERATIONS
// ----------------------------------------------------

// GET /api/dept-admin/issues - Get all issues for my department
deptAdminRouter.get("/issues", async (req, res) => {
  try {
    const departmentId = req.user.departmentId;
    
    const issues = await Issue.find({ departmentId })
      .select("-completionImageUrl -imageUrl") // Exclude heavy image strings from the massive roster list payload
      .populate("assignedWorkerId", "name") // Exclude full object, just get worker name
      .populate("citizenId", "name") // Just get citizen name
      .sort({ createdAt: -1 })
      .limit(500) // Safeguard against payload explosion
      .lean();

    res.json({ issues });
  } catch (error) {
    console.error("DeptAdmin GET Issues Error:", error);
    res.status(500).json({ message: "Internal server error fetching department issues." });
  }
});

// GET /api/dept-admin/issues/:id - Get specific issue details
deptAdminRouter.get("/issues/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const departmentId = req.user.departmentId;

    const issue = await Issue.findOne({ _id: id, departmentId })
      .populate("assignedWorkerId")
      .populate("citizenId", "name email")
      .lean();

    if (!issue) {
      return res.status(404).json({ message: "Issue not found or unauthorized." });
    }

    res.json({ issue });
  } catch (error) {
    console.error("DeptAdmin GET Issue By ID Error:", error);
    res.status(500).json({ message: "Internal server error fetching issue details." });
  }
});

// PUT /api/dept-admin/issues/:id/priority - Update issue priority
deptAdminRouter.put("/issues/:id/priority", async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    const departmentId = req.user.departmentId;

    if (!["Low", "Medium", "High"].includes(priority)) {
       return res.status(400).json({ message: "Invalid priority level." });
    }

    const issue = await Issue.findOne({ _id: id, departmentId });
    if (!issue) {
       return res.status(404).json({ message: "Issue not found or unauthorized." });
    }

    issue.priority = priority;
    await issue.save();

    res.json({ message: "Priority updated", issue });
  } catch (error) {
    console.error("DeptAdmin Change Priority Error:", error);
    res.status(500).json({ message: "Internal server error updating priority." });
  }
});

// PUT /api/dept-admin/issues/:id/verify - Verify and close an issue
deptAdminRouter.put("/issues/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const departmentId = req.user.departmentId;

    const issue = await Issue.findOne({ _id: id, departmentId });
    if (!issue) {
       return res.status(404).json({ message: "Issue not found or unauthorized." });
    }

    if (issue.status !== "Resolved") {
       return res.status(400).json({ message: "Only completely 'Resolved' issues can be verified and closed." });
    }

    issue.status = "Closed";
    await issue.save();

    res.json({ message: "Issue successfully verified and closed.", issue });
  } catch (error) {
    console.error("DeptAdmin Verify Issue Error:", error);
    res.status(500).json({ message: "Internal server error verifying issue." });
  }
});

// GET /api/dept-admin/analytics - Worker efficiency metrics
deptAdminRouter.get("/analytics", async (req, res) => {
  try {
    const departmentId = req.user.departmentId;
    if (!departmentId) {
      return res.status(403).json({ message: "Admin is missing a department assignment." });
    }

    // 1. Fetch all worker profiles for this department
    const departmentWorkers = await Worker.find({ 
       departmentId: departmentId 
    }).populate("userId", "name email");

    // 2. Aggregate issues by worker to calculate performance metrics
    const workerStats = await Issue.aggregate([
      { 
        $match: { 
           departmentId: new mongoose.Types.ObjectId(departmentId),
           assignedWorkerId: { $ne: null } 
        } 
      },
      {
        $group: {
          _id: "$assignedWorkerId",
          totalAssigned: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $in: ["$status", ["Resolved", "Closed"]] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $in: ["$status", ["Submitted", "Assigned", "InProgress"]] }, 1, 0] }
          }
        }
      }
    ]);

    // 3. Map the stats back to the full list of workers
    const statsMap = workerStats.reduce((acc, curr) => {
       acc[curr._id.toString()] = curr;
       return acc;
    }, {});

    const analytics = departmentWorkers.map(workerProfile => {
       const user = workerProfile.userId;
       if (!user) return null; // Protect against orphaned records

       const stat = statsMap[workerProfile._id.toString()] || { totalAssigned: 0, completed: 0, pending: 0 };
       
       return {
         workerId: workerProfile._id, // Frontend uses this as key
         workerName: user.name,
         workerEmail: user.email,
         totalAssigned: stat.totalAssigned,
         completed: stat.completed,
         pending: stat.pending,
         completionRate: stat.totalAssigned > 0 ? Math.round((stat.completed / stat.totalAssigned) * 100) : 0
       };
    }).filter(w => w !== null);

    res.json({ analytics });
  } catch (error) {
    console.error("DeptAdmin Analytics Error:", error);
    res.status(500).json({ message: "Internal server error generating analytics." });
  }
});

module.exports = { deptAdminRouter };
