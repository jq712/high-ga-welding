const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📊 MongoDB connected");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("📊 Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database connection:", error.message);
  }
};

module.exports = {
  connectDB,
  closeDatabase
};
