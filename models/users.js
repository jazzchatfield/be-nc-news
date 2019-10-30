const connection = require("../db/connection");

const fetchUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(data => {
      return data[0];
    });
};

module.exports = { fetchUserByUsername };
