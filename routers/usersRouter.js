const express = require("express");
const { getUserByUsername } = require("../controllers/users");
const { send405Error } = require("../errors/index");

const usersRouter = express.Router();

usersRouter.route("/").all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
