const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

const sequelize = require("./models").sequelize;

const indexRouter = require("./routes/index");

dotenv.config();

const app = express();

sequelize.sync({
  logging: console.log,
  // force: true
});

const corsOption = {
  origin: "*",
  methods: "GET, PUT, PATCH, POST, DELETE",
  exposedHeaders: "*"
};
app.use(cors(corsOption));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../todo-app-client/dist")));

app.use("/api/tasks", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
