const express = require("express");
const Department = require("../models/Department");
const Issue = require("../models/Issue");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

const departmentsRouter = express.Router();

// Allow any authenticated user to fetch departments (needed for Citizens reporting issues)
departmentsRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const departments = await Department.find({}).lean();
    res.json({ departments });
  } catch (error) {
    console.error("Fetch Departments Error:", error);
    res.status(500).json({ message: "Internal server error fetching departments" });
  }
});

// Admin-only routes
departmentsRouter.post("/", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Department name is required" });
    }

    const existingName = await Department.findOne({ name: name.trim() });
    if (existingName) {
      return res.status(409).json({ message: "Department already exists" });
    }

    const department = new Department({ name: name.trim() });
    await department.save();

    res.status(201).json({
      department: {
        id: department._id,
        name: department.name
      }
    });
  } catch (error) {
    console.error("Create Department Error:", error);
    res.status(500).json({ message: "Internal server error creating department" });
  }
});

// PUT /api/departments/:id - Rename a Department
departmentsRouter.put("/:id", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Department name is required" });
    }

    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: "Department not found." });

    const existingName = await Department.findOne({ name: name.trim() });
    if (existingName && existingName._id.toString() !== req.params.id) {
      return res.status(409).json({ message: "A department with this name already exists." });
    }

    dept.name = name.trim();
    await dept.save();

    res.json({ message: "Department updated.", department: dept });
  } catch (error) {
    console.error("Update Department Error:", error);
    res.status(500).json({ message: "Failed to update department." });
  }
});

// DELETE /api/departments/:id - Delete a Department
departmentsRouter.delete("/:id", authMiddleware, requireRole("SuperAdmin"), async (req, res) => {
  try {
    const deptId = req.params.id;
    const dept = await Department.findById(deptId);
    if (!dept) return res.status(404).json({ message: "Department not found." });

    // Enforce deletion restraints: we cannot delete it if issues or users are tied to it!
    const tiedIssues = await Issue.countDocuments({ departmentId: deptId });
    if (tiedIssues > 0) {
      return res.status(400).json({ message: `Cannot delete: ${tiedIssues} issues belong to this department.` });
    }

    const tiedUsers = await User.countDocuments({ departmentId: deptId });
    if (tiedUsers > 0) {
      return res.status(400).json({ message: `Cannot delete: ${tiedUsers} personnel belong to this department.` });
    }

    await Department.findByIdAndDelete(deptId);
    res.json({ message: "Department successfully deleted." });
  } catch (error) {
    console.error("Delete Department Error:", error);
    res.status(500).json({ message: "Failed to delete department." });
  }
});

module.exports = { departmentsRouter };
