const express = require("express");
const { getTopics } = require("../controllers/topics");
const { send405Error } = require("../errors/index");

const topicsRouter = express.Router();

topicsRouter
  .route("/")
  .get(getTopics)
  .all(send405Error);

module.exports = topicsRouter;
