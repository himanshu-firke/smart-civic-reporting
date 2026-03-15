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

    const normalizedEmail = email.toLowerCase();
    
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name,
      email: normalizedEmail,
      passwordHash,
      role: "DepartmentAdmin",
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

// PUT /api/admin/department-admins/:id - Update an existing Dept Admin
adminRouter.put("/department-admins/:id", async (req, res) => {
  try {
    const { name, email, departmentId } = req.body;
    const adminUser = await User.findById(req.params.id);

    if (!adminUser || (adminUser.role !== "DepartmentAdmin" && adminUser.role !== "Department Admin")) {
      return res.status(404).json({ message: "Department Admin not found." });
    }

    let normalizedEmail = email;
    if (email && email.toLowerCase() !== adminUser.email.toLowerCase()) {
      normalizedEmail = email.toLowerCase();
      const emailExists = await User.findOne({ email: normalizedEmail });
      if (emailExists) return res.status(400).json({ message: "Email already taken." });
      adminUser.email = normalizedEmail;
    }

    if (name) adminUser.name = name;
    if (departmentId) {
      const deptExists = await Department.findById(departmentId);
      if (!deptExists) return res.status(400).json({ message: "Invalid department ID." });
      adminUser.departmentId = departmentId;
    }

    await adminUser.save();
    res.json({ message: "Department Admin updated", user: adminUser });
  } catch (error) {
    console.error("Update Dept Admin Error:", error);
    res.status(500).json({ message: "Server error updating config." });
  }
});

// DELETE /api/admin/department-admins/:id - Remove a Dept Admin
adminRouter.delete("/department-admins/:id", async (req, res) => {
  try {
    const adminUser = await User.findById(req.params.id);
    if (!adminUser || (adminUser.role !== "DepartmentAdmin" && adminUser.role !== "Department Admin")) {
      return res.status(404).json({ message: "Department Admin not found." });
    }

    // Optional: Reassign workers or orphaned data if necessary, here we just delete
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Department Admin successfully removed." });
  } catch (error) {
    console.error("Delete Dept Admin Error:", error);
    res.status(500).json({ message: "Server error deleting admin." });
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

    // Aggregate issues by department AND status
    const departmentStatsRaw = await Issue.aggregate([
      { 
        $group: { 
          _id: { departmentId: "$departmentId", status: "$status" }, 
          count: { $sum: 1 } 
        } 
      }
    ]);

    const departments = await Department.find({}).lean();
    const deptMap = {};
    departments.forEach(d => {
      deptMap[d._id.toString()] = {
        name: d.name,
        statuses: { Submitted: 0, Assigned: 0, InProgress: 0, Resolved: 0, Closed: 0 }
      };
    });

    departmentStatsRaw.forEach(stat => {
      const dId = stat._id.departmentId ? stat._id.departmentId.toString() : null;
      if (dId && deptMap[dId]) {
        deptMap[dId].statuses[stat._id.status] = stat.count;
      }
    });

    const byStatus = { Submitted: 0, Assigned: 0, InProgress: 0, Resolved: 0, Closed: 0 };
    statusCounts.forEach(item => {
      if (byStatus[item._id] !== undefined) byStatus[item._id] = item.count;
    });

    res.json({
      metrics: {
        totalIssues,
        byStatus,
        byDepartment: Object.values(deptMap)
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
