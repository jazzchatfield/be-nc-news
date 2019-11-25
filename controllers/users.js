const {
  fetchUserByUsername,
  createUser,
  fetchUsers,
  removeUser
} = require("../models/users");

const getUserByUsername = (req, res, next) => {
  const username = req.params.username;

  fetchUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const postUser = (req, res, next) => {
  let { username, avatar_url, name } = req.body;
  if (avatar_url === undefined) {
    avatar_url =
      "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png";
  }
  createUser(username, name, avatar_url)
    .then(user => {
      res.status(201).send({ user });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  fetchUsers().then(users => {
    res.status(200).send({ users });
  });
};

const deleteUser = (req, res, next) => {
  const username = req.params.username;
  removeUser(username)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = { getUserByUsername, postUser, getUsers, deleteUser };
