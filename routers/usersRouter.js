const express = require("express");
const { getUserByUsername } = require("../controllers/users");

const usersRouter = express.Router();

usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
