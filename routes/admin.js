const express = require("express");
const expressValidator = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  isAuth,
  [
    expressValidator.body("title").isString().isLength({ min: 3 }).trim(),
    expressValidator.body("price").isFloat(),
    expressValidator.body("description").isLength({ min: 5, max: 400 }),
  ],
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    expressValidator.body("title").isString().isLength({ min: 3 }).trim(),
    expressValidator.body("price").isFloat(),
    expressValidator.body("description").isLength({ min: 5, max: 400 }),
  ],
  isAuth,
  adminController.postEditProduct
);

// router.post("/delete-product", isAuth, adminController.postDeleteProduct);
router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
