const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //reject file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  }
  cb(null, false);
};
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  }
});

const ProductController = require("../controllers/products");

router.get("/", ProductController.products_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.products_create
);

router.get("/:productId", ProductController.products_get_one);

router.patch("/:productId", checkAuth, ProductController.products_update);

router.delete("/:productId", checkAuth, ProductController.products_delete);

module.exports = router;
