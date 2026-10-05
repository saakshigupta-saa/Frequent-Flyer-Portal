require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app");
const connectDatabase = require("../src/config/database");

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Frequent Flyer Portal API", () => {
  test("GET /api/health should return API status", async () => {
    const response = await request(app)
      .get("/api/health");

    expect(response.statusCode).toBe(200);

    expect(response.body.status).toBe("ok");
  });

  test("GET /api/frequent-flyers should return members", async () => {
    const response = await request(app)
      .get("/api/frequent-flyers");

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /api/frequent-flyers should reject negative miles", async () => {
    const response = await request(app)
      .post("/api/frequent-flyers")
      .send({
        firstName: "Test",
        lastName: "User",
        email: `negative-${Date.now()}@example.com`,
        phone: "9876543215",
        membershipTier: "BASIC",
        miles: -500,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.error).toBe(
      "Miles must be a non-negative number"
    );
  });

  test("POST /api/frequent-flyers should reject invalid membership tier", async () => {
    const response = await request(app)
      .post("/api/frequent-flyers")
      .send({
        firstName: "Test",
        lastName: "User",
        email: `tier-${Date.now()}@example.com`,
        phone: "9876543216",
        membershipTier: "DIAMOND",
        miles: 1000,
      });

    expect(response.statusCode).toBe(400);

    expect(response.body.error).toBe(
      "Invalid membership tier"
    );
  });

  test("POST /api/frequent-flyers should sanitize script tags", async () => {
    const response = await request(app)
      .post("/api/frequent-flyers")
      .send({
        firstName:
          "<script>alert('XSS')</script>SafeUser",
        lastName: "Test",
        email: `xss-${Date.now()}@example.com`,
        phone: "9876543217",
        membershipTier: "BASIC",
        miles: 1000,
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.firstName).toBe(
      "SafeUser"
    );
  });
});