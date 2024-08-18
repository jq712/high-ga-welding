const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config();

let mongod;

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === "test") {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
    } else {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    console.log("📊 MongoDB connected");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    if (process.env.NODE_ENV === "test" && mongod) {
      await mongod.stop();
    }
    console.log("📊 Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database connection:", error.message);
  }
};

const clearDatabase = async () => {
  if (process.env.NODE_ENV !== "test") {
    console.warn(
      "⚠️ Attempting to clear non-test database. Operation aborted."
    );
    return;
  }
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  console.log("🧹 Test database cleared");
};

module.exports = {
  connectDB,
  closeDatabase,
  clearDatabase,
};
