const express = require("express");
const apiRouter = require("./routers/apiRouter");
const { handleCustomErrors } = require("./errors/index");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);

module.exports = app;
