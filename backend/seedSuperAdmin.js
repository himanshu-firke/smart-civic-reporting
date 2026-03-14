require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

async function seedSuperAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI is missing in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const email = "superadmin@civic.com";
    const password = "supersecurepassword123!"; // You can change this when you log in!

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`\nSuper Admin already exists!`);
      console.log(`Email: ${email}`);
      console.log(`Password: (whatever you set previously)`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const superAdmin = new User({
        name: "System Super Admin",
        email: email,
        passwordHash: passwordHash,
        role: "SuperAdmin"
      });

      await superAdmin.save();
      console.log(`\n🎉 Super Admin successfully created!`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    }

    console.log("\nYou can now exit this script and log in on the frontend.");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding Super Admin:", error);
    process.exit(1);
  }
}

seedSuperAdmin();
