const express = require("express");
const { getTopics, postTopic } = require("../controllers/topics");
const { send405Error } = require("../errors/index");

const topicsRouter = express.Router();

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(send405Error);

module.exports = topicsRouter;
