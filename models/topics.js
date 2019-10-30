const connection = require("../db/connection");

const fetchTopics = () => {
  return connection.select("slug", "description").from("topics");
};

module.exports = { fetchTopics };
