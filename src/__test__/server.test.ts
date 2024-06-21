import { connectDB } from "../server";
import db from "../config/db";

jest.mock("../config/db");

describe("Connect DB", () => {
  it("Should handle db connection error", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValueOnce(new Error("There was an error on DB"));
    const consoleSpy = jest.spyOn(console, "log");

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("There was an error on DB")
    );
  });
});
