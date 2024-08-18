require("dotenv").config();
const mongoose = require("mongoose");

console.log("Environment variables:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");
if (process.env.MONGODB_URI) {
  console.log(
    "MONGODB_URI value:",
    process.env.MONGODB_URI.replace(/:([^:@]{1,}@)/, ":****@")
  );
}

async function testConnection() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("Successfully connected to MongoDB!");
    const dbs = await mongoose.connection.db.admin().listDatabases();
    console.log(
      "Available databases:",
      dbs.databases.map((db) => db.name).join(", ")
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    console.error("Full error:", error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("Connection closed");
    }
  }
}

testConnection();
