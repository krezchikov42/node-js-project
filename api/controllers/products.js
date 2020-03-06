const Product = require("../models/product");
const mongoose = require("mongoose");

exports.products_get_all = (req, res, next) => {
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
};

exports.products_create = (req, res, next) => {
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
};

exports.products_get_one = (req, res, next) => {
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
};

exports.products_update = (req, res, next) => {
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
};

exports.products_delete = (req, res, next) => {
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
};
