const express = require("express");
const Department = require("../models/Department");
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

module.exports = { departmentsRouter };
