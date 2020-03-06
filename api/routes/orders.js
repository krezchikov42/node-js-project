const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../middleware/check-auth')

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", checkAuth, (req, res, next) => {
  Order.find()
    .select("-__v")
    .populate("product", "name")
    .exec()
    .then(results =>
      res.status(200).json({
        message: "orders were fetched",
        count: results.length,
        orders: results.map(result => {
          return {
            name: result.name,
            quantity: result.quantity,
            product: result.product,
            _id: result._id,
            request: {
              type: "GET",
              url: `http://localhost:3000/orders/${result.id}`
            }
          };
        })
      })
    )
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

router.post("/", checkAuth, (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        throw Error("Product not found");
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result =>
      res.status(201).json({
        message: "Created an order with post",
        order: result,
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${result.id}`
        }
      })
    )
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Product not found!", error });
    });
});

router.get("/:orderId", checkAuth, (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then(order =>
      res.status(200).json({
        message: "Order get request",
        order
      })
    )
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Order not found!", error });
    });
});

router.delete("/:orderId", checkAuth, (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result =>
      res.status(200).json({
        message: "Order was deleted"
      })
    )
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Order not found!", error });
    });
});

module.exports = router;
