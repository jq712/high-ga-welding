const { connectDB, clearDatabase, closeDatabase } = require("../config/db");
const {
  createInitialAdmin,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} = require("../createInitialAdmin");
const request = require("supertest");
const { app } = require("../server");

beforeAll(async () => {
  await connectDB();
  await createInitialAdmin();
});

beforeEach(async () => {
  await clearDatabase();
  await createInitialAdmin();
});

afterAll(async () => {
  await closeDatabase();
});

global.loginUser = async (email, password) => {
  console.log(`🔑 Attempting login: ${email}`);
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  if (response.status !== 200) {
    console.error(`❌ Login failed for ${email}: ${response.body.message}`);
    console.error("Response:", response.body);
  } else {
    console.log(`✅ Login successful: ${email}`);
  }

  return response;
};

// This line prevents Jest from treating this file as a test suite
test.skip("placeholder", () => {});
