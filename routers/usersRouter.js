const express = require("express");
const {
  getUserByUsername,
  postUser,
  getUsers,
  deleteUser
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
  .delete(deleteUser)
  .all(send405Error);

module.exports = usersRouter;
