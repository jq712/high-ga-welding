const User = require("./models/Users");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const ADMIN_EMAIL = "712.jordanq@gmail.com";
const ADMIN_PASSWORD = "Strongpassword14!";

async function createInitialAdmin() {
  try {
    let adminUser = await User.findOne({ email: ADMIN_EMAIL });
    if (adminUser) {
      console.log("👤 Admin user already exists. Updating...");
    } else {
      console.log("👤 Creating new admin user...");
      adminUser = new User({
        email: ADMIN_EMAIL,
        role: "admin",
        isAdmin: true,
      });
    }

    // Always set the password
    adminUser.password = ADMIN_PASSWORD;

    await adminUser.save();
    console.log(
      `✅ Admin user ${adminUser.isNew ? "created" : "updated"} successfully`
    );
    console.log(
      `📊 Admin: ${adminUser.email} (${adminUser.role}, Admin: ${adminUser.isAdmin})`
    );

    return adminUser;
  } catch (error) {
    console.error("❌ Error creating/updating initial admin:", error.message);
    throw error;
  }
}

module.exports = { createInitialAdmin, ADMIN_EMAIL, ADMIN_PASSWORD };
