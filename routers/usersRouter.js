const express = require("express");
const {
  getUserByUsername,
  postUser,
  getUsers
} = require("../controllers/users");
const { send405Error } = require("../errors/index");

const usersRouter = express.Router();

usersRouter
  .route("/")
  .get(getUsers)
  .post(postUser)
  .all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
