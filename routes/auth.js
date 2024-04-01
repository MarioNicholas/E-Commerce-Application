const express = require("express");
const expressValidator = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignUp);
router.post(
  "/signup",
  [
    expressValidator
      .check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email already existed, please use different email"
            );
          }
        });
      })
      .normalizeEmail(),
    expressValidator
      .body(
        "password",
        "Please enter a password with only numbers and text and at least 8 characters"
      )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    expressValidator
      .body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignUp
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/new-password/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
