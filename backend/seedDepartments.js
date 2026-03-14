require("dotenv").config();
const mongoose = require("mongoose");
const Department = require("./src/models/Department");

async function seedDepartments() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI is missing in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const departmentsToSeed = [
      { name: "Water Management" },
      { name: "Roads & Transport" },
      { name: "Waste & Sanitation" },
      { name: "Electricity Board" },
      { name: "Public Parks" }
    ];

    console.log("Seeding departments...");

    for (const dept of departmentsToSeed) {
      const exists = await Department.findOne({ name: dept.name });
      if (!exists) {
        await Department.create(dept);
        console.log(`Created: ${dept.name}`);
      } else {
        console.log(`Already exists: ${dept.name}`);
      }
    }

    console.log("\n✅ Departments seeded successfully!");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding departments:", error);
    process.exit(1);
  }
}

seedDepartments();
