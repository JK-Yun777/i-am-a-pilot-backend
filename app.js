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

const whiteList = ["http://localhost:3000"];
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
const URL = process.env.MONGO_DB_URL;

mongoose.connect(URL);

const db = mongoose.connection;

db.on("error", function (err) {
  console.log("mongodb Error", err);
});

db.on("open", function () {
  console.log("DB Open");
});

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
