const request = require("supertest");
const { app } = require("../server");
const User = require("../models/Users");
const AllowedEmail = require("../models/AllowedEmail");

describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user with valid data", async () => {
      await AllowedEmail.create({ email: "test@example.com" });
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "Password123!",
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.user.email).toBe("test@example.com");
    });

    it("should not register a user with an email not in AllowedEmail", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "notallowed@example.com",
        password: "Password123!",
      });
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("fail");
    });

    it("should not register a user with invalid password", async () => {
      await AllowedEmail.create({ email: "test@example.com" });
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "weak",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login a user with correct credentials", async () => {
      await User.create({
        email: "test@example.com",
        password: "Password123!",
      });
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "Password123!",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should not login a user with incorrect password", async () => {
      await User.create({
        email: "test@example.com",
        password: "Password123!",
      });
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "WrongPassword123!",
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe("fail");
    });

    it("should not login a non-existent user", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "Password123!",
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("GET /api/auth/current-user", () => {
    it("should get current user if logged in", async () => {
      const user = await User.create({
        email: "test@example.com",
        password: "Password123!",
      });
      const agent = request.agent(app);
      await agent.post("/api/auth/login").send({
        email: "test@example.com",
        password: "Password123!",
      });
      const res = await agent.get("/api/auth/current-user");
      expect(res.statusCode).toBe(200);
      expect(res.body.data.user.email).toBe("test@example.com");
    });

    it("should return 401 if not logged in", async () => {
      const res = await request(app).get("/api/auth/current-user");
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout a logged in user", async () => {
      const agent = request.agent(app);
      await User.create({
        email: "test@example.com",
        password: "Password123!",
      });
      await agent.post("/api/auth/login").send({
        email: "test@example.com",
        password: "Password123!",
      });
      const res = await agent.post("/api/auth/logout");
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should return 401 if not logged in", async () => {
      const res = await request(app).post("/api/auth/logout");
      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe("fail");
    });
  });
});
