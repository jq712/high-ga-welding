const path = require("path");

module.exports = {
  testTimeout: 300000,
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
  rootDir: path.join(__dirname, ".."),
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest.setup.js"],
};
