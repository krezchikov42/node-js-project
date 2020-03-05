const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({ message: "Email exists" });
      }

      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json(error);
        }

        const user = new User({
          _id: mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash
        });
        user
          .save()
          .then(result => {
            console.log(result);
            res.status(200).json({
              message: "User created"
            });
          })
          .catch(error => {
            console.log(error);
            res.status(500).json(error);
          });
      });
    });
});

router.delete("/:userId", function(req, res) {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res
        .status(200)
        .json({ message: `User with id ${req.params.userId} was deleted` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

module.exports = router;
