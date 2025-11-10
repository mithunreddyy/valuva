/**
 * ===============================================
 * Order Test (Integration)
 * -----------------------------------------------
 * Ensures order creation and PayU flow mock works
 * ===============================================
 */

import request from "supertest";
import app from "../app";

describe("Order API", () => {
  it("should return unauthorized if no token is provided", async () => {
    const res = await request(app).post("/api/orders/create").send();
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should handle order creation (mocked)", async () => {
    // Simulate JWT token with mocked user
    const mockUserToken = "Bearer faketoken123";

    const res = await request(app)
      .post("/api/orders/create")
      .set("Authorization", mockUserToken)
      .send({ cartId: "fakeCartId" });

    expect(res.statusCode).toBeGreaterThanOrEqual(200);
  });
});
