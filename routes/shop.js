const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const router = express.Router();

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth")
const adminData = require("./admin");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getDetailedProduct);

router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.get("/orders", isAuth, shopController.getOrders);
router.get('/orders/:orderId', isAuth, shopController.getInvoice)

router.get("/checkout", isAuth, shopController.getCheckout);
router.get("/checkout/success", isAuth, shopController.getCheckoutSuccess);
router.get("/checkout/cancel", isAuth, shopController.getCheckout);

module.exports = router;
