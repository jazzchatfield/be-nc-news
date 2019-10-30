const { fetchUserByUsername } = require("../models/users");

const getUserByUsername = (req, res, next) => {
  const username = req.params.username;
  fetchUserByUsername(username).then(user => {
    console.log(user);
    res.status(200).send({ user });
  });
};

module.exports = { getUserByUsername };
