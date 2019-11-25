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

const removeUser = username => {
  const getArticles = connection("articles")
    .select("*")
    .where({ author: username });

  const deleteUserComments = connection("comments")
    .del()
    .where({ author: username });

  const deleteArticles = connection("articles")
    .del()
    .where({ author: username });

  const deleteUser = connection("users")
    .del()
    .where({ username });

  return getArticles
    .then(articles => {
      const promiseArray = articles.map(article => {
        return connection("comments")
          .del()
          .where({ article_id: article.article_id });
      });
      return Promise.all(promiseArray);
    })
    .then(() => {
      return deleteUserComments;
    })
    .then(() => {
      return deleteArticles;
    })
    .then(() => {
      return deleteUser;
    });
};

module.exports = { fetchUserByUsername, createUser, fetchUsers, removeUser };
