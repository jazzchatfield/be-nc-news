const connection = require("../db/connection");

const fetchTopics = () => {
  return connection.select("slug", "description").from("topics");
};

const createTopic = (slug, description) => {
  return connection("topics")
    .insert({ slug, description })
    .returning("*")
    .then(rows => {
      return rows[0];
    });
};

module.exports = { fetchTopics, createTopic };
