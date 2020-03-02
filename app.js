const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParse = require("body-parser");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
// app.use((req,res,next)=> {
//     res.status(200).json({
//         message: "it works"
//     })
// })

app.use(morgan("dev"));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());

//stopping COORS errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
