const { ADMIN_EMAIL, ADMIN_PASSWORD } = require("../createInitialAdmin");

describe("Admin Login Test", () => {
  it("should login successfully with admin credentials", async () => {
    const response = await global.loginUser(ADMIN_EMAIL, ADMIN_PASSWORD);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.user.email).toBe(ADMIN_EMAIL);
    expect(response.body.data.user.role).toBe("admin");
    expect(response.body.data.user.isAdmin).toBe(true);
  });
});
