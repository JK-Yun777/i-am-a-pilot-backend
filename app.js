require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const index = require("./routes/index");
const user = require("./routes/user");
const login = require("./routes/login");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const whiteList = [
  process.env.FRONT_END_URL_ONE,
  process.env.FRONT_END_URL_TWO,
  process.env.FRONT_END_URL_API,
  process.env.FRONT_END_URL_LOCAL,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed Origin"));
    }
  },
};
app.use(cors(corsOptions));

const port = app.listen(process.env.PORT || 8000);

mongoose.connect(
  process.env.MONGO_DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("MongoDB Connected");
    }
  },
);

app.use("/", index);
app.use("/user", user);
app.use("/login", login);

app.listen(port, function () {
  console.log("Server Connected");
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;
