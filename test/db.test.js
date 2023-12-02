const { expect } = require("chai");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

describe("Database Connection", () => {
  it("should connect to the database", async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      expect(mongoose.connection.readyState).to.equal(1);
      mongoose.connection.close();
    } catch (error) {
      expect.fail("Failed to connect to the database");
    }
  });
});
