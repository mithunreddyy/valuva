import request from "supertest"; 
import app from "../app";

describe("Auth API", function () {
  it("should return 404 for invalid route", async function () {
    const res = await request(app).get("/invalid");
    expect(res.statusCode).toBe(404);
  });
});
