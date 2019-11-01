const connection = require("../db/connection");

const fetchUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(data => {
      if (data.length === 0) {
        return { err: { status: 422, msg: "username not found" } };
      } else return data[0];
    });
};

module.exports = { fetchUserByUsername };
