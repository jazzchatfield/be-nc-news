const express = require("express");
const cors = require("cors");
const apiRouter = require("./routers/apiRouter");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors
} = require("./errors/index");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
