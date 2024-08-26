const User = require("./models/Users");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function createInitialAdmin() {
  try {
    const adminUser = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        email: ADMIN_EMAIL,
        role: "admin",
        isAdmin: true,
        password: ADMIN_PASSWORD
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    const action = adminUser.isNew ? "created" : "updated";
    console.log(`✅ Admin user ${action} successfully`);
    console.log(`📊 Admin: ${adminUser.email} (${adminUser.role}, Admin: ${adminUser.isAdmin})`);

    return adminUser;
  } catch (error) {
    console.error("❌ Error creating/updating initial admin:", error.message);
    throw error;
  }
}

module.exports = { createInitialAdmin };
