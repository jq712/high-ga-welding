const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.disconnect();
  console.log("All connections closed in teardown");
};
