const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
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

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("-__v")
    .exec()
    .then(results => {
      const response = {
        count: results.length,
        products: results.map(result => {
          return {
            name: result.name,
            price: result.price,
            _id: result._id,
            productImage: result.productImage,
            request: {
              type: "GET",
              url: `http://localhost:3000/products/${result.id}`
            }
          };
        })
      };
      console.log(response);
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Hangling post products",
        createdProduct: {
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          _id: result._id,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${result.id}`
          }
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("-__v")

    .exec()
    .then(result => {
      console.log(result);
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(404).json({ message: "No valid product for provided ID" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

router.patch("/:productId", (req, res, next) => {
  const _id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

router.delete("/:productId", (req, res, next) => {
  const _id = req.params.productId;
  Product.remove({ _id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

module.exports = router;
