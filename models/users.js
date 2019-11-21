const connection = require("../db/connection");

const fetchUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(data => {
      if (data.length === 0) {
        return Promise.reject({ status: 404, msg: "username not found" });
      } else return data[0];
    });
};

const createUser = (username, name, avatar_url) => {
  return connection("users")
    .insert({ username, name, avatar_url })
    .returning("*")
    .then(rows => {
      return rows[0];
    });
};

const fetchUsers = () => {
  return connection("users")
    .select("*")
    .then(rows => {
      return rows;
    });
};

module.exports = { fetchUserByUsername, createUser, fetchUsers };
