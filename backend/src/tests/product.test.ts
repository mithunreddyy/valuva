/**
 * ===============================================
 * Product Test
 * -----------------------------------------------
 * Verifies product CRUD endpoints function properly
 * ===============================================
 */

import request from "supertest";
import app from "../app";

describe("Product API", () => {
  it("should fetch all products successfully", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("should return 404 for invalid product ID", async () => {
    const res = await request(app).get("/api/products/invalid-id");
    expect([400, 404]).toContain(res.statusCode);
  });
});
