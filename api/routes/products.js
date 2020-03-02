const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then(results => {
      console.log(results);
      res.status(200).json(results);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Hangling post products",
        createdProduct: result
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
