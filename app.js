const express = require("express");
const apiRouter = require("./routers/apiRouter");
const { handleCustomErrors, handlePsqlErrors } = require("./errors/index");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

module.exports = app;
