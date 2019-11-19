const express = require("express");

const { send405Error } = require("../errors/index");
const apiEndpoints = require("../controllers/apiEndpoints");

const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");

const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter
  .route("/")
  .get(apiEndpoints)
  .all(send405Error);

module.exports = apiRouter;
