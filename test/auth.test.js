const { expect } = require("chai");
const authController = require("../controllers/auth.controller.js");

describe("AuthController", () => {
  describe("isValidPassword", () => {
    it("should return true for a valid password", () => {
      expect(authController.isValidPassword("Z1xcvbnm,./!")).to.be.true;
      expect(authController.isValidPassword("Abcd123.")).to.be.true;
    });

    it("should return false for an invalid password", () => {
      expect(authController.isValidPassword("abcd123")).to.be.false;
      expect(authController.isValidPassword("Z1xc./a")).to.be.false;
    });
  });

  describe("isValidEmail", () => {
    it("should return true for a valid email", () => {
      expect(authController.isValidEmail("sadnamsakib@iut-dhaka.edu")).to.be
        .true;
    });

    it("should return false for an invalid email", () => {
      expect(authController.isValidEmail("sadnamsakib@abc")).to.be.false;
    });
  });
});
