const mongoose = require("mongoose");
const AllowedEmail = require("./models/AllowedEmail");
require("dotenv").config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

if (!ADMIN_EMAIL) {
    console.error("❌ Error: ADMIN_EMAIL must be set in .env file");
    process.exit(1);
}

async function createAllowedEmail() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const allowedEmail = await AllowedEmail.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        email: ADMIN_EMAIL,
        role: "admin",
        addedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const action = allowedEmail.isNew ? "created" : "updated";
    console.log(`✅ Allowed email ${action} successfully`);
    console.log(`📊 Email: ${allowedEmail.email} (Role: ${allowedEmail.role})`);

    await mongoose.connection.close();
    return allowedEmail;
  } catch (error) {
    console.error("❌ Error creating/updating allowed email:", error.message);
    throw error;
  }
}

if (require.main === module) {
    createAllowedEmail()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { createAllowedEmail };
