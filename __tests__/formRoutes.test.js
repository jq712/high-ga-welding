const request = require("supertest");
const { app } = require("../server");
const Form = require("../models/Form");
const User = require("../models/Users");

describe("Form Routes", () => {
  describe("POST /api/forms", () => {
    it("should submit a form with valid data", async () => {
      const res = await request(app).post("/api/forms").send({
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        message: "Test message",
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.form.name).toBe("Test User");
    });

    it("should not submit a form with missing data", async () => {
      const res = await request(app).post("/api/forms").send({
        name: "Test User",
        email: "test@example.com",
        // missing phone and message
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("should not submit a form with invalid email", async () => {
      const res = await request(app).post("/api/forms").send({
        name: "Test User",
        email: "invalid-email",
        phone: "1234567890",
        message: "Test message",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("GET /api/forms", () => {
    it("should get all forms for admin user", async () => {
      const admin = await User.create({
        email: "admin@example.com",
        password: "Password123!",
        role: "admin",
        isAdmin: true,
      });
      await Form.create({
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        message: "Test message",
      });
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({
        email: "admin@example.com",
        password: "Password123!",
      });
      const res = await agent.get("/api/forms");
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.forms.length).toBe(1);
    });

    it("should not allow non-admin users to get forms", async () => {
      const user = await User.create({
        email: "user@example.com",
        password: "Password123!",
        role: "user",
        isAdmin: false,
      });
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({
        email: "user@example.com",
        password: "Password123!",
      });
      const res = await agent.get("/api/forms");
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("fail");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const res = await request(app).get("/api/forms");
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe("fail");
    });
  });
});
