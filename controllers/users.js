const { fetchUserByUsername } = require("../models/users");

const getUserByUsername = (req, res, next) => {
  const username = req.params.username;

  fetchUserByUsername(username)
    .then(user => {
      if (user.err) next(user.err);
      else res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = { getUserByUsername };
