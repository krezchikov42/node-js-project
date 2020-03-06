const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

router.post("/login", function(req, res) {
  User.find({ email: req.body.email })
    .exec()
    .then(results => {
      if (results.length < 1) {
        res.status(401).json({
          message: "Auth failed"
        });
      } else {
        const user = results[0];
        bcrypt.compare(req.body.password, user.password, (error, bresult) => {
          if (error || !bresult) {
            return res.status(500).json({
              message: "Auth Failed"
            });
          }
          if (bresult) {
            const token = jwt.sign(
              { email: user.email, userId: user._id },
              process.env.JWT_KEY,
              { expiresIn: "1h" }
            );
            return res.status(400).json({
              message: "Auth Successful",
              token
            });
          }
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
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
