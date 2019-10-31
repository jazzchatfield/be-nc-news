const connection = require("../db/connection");

const fetchArticleById = article_id => {
  const getArticle = connection
    .select("*")
    .from("articles")
    .where({ article_id });
  const getComments = connection
    .select("*")
    .from("comments")
    .where({ article_id });
  return Promise.all([getArticle, getComments]).then(([article, comments]) => {
    article[0].comment_count = comments.length;
    return article[0];
  });
};

const updateArticleVotesById = (article_id, inc_votes) => {
  return connection
    .select("votes")
    .from("articles")
    .where({ article_id })
    .then(rows => {
      let oldVotes = parseInt(rows[0].votes);
      let newVotes = oldVotes + parseInt(inc_votes);
      return connection("articles")
        .update({ votes: newVotes })
        .where({ article_id })
        .returning("*");
    })
    .then(rows => {
      return rows[0];
    });
};

const createCommentByArticle = (article_id, username, body) => {
  let commentObj = { article_id, author: username, body };
  return connection("comments")
    .insert(commentObj)
    .returning("*")
    .then(rows => {
      return rows[0];
    });
};

const fetchCommentsByArticle = (article_id, sort_by, order) => {
  return connection
    .select("*")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by, order)
    .then(rows => {
      return rows.map(row => {
        delete row.article_id;
        return row;
      });
    });
};

const fetchArticles = (sort_by, order, author, topic) => {
  return connection
    .select("author", "title", "article_id", "topic", "created_at", "votes")
    .from("articles")
    .modify(function(queryBuilder) {
      if (author !== undefined) {
        queryBuilder.where({ author });
      }
      if (topic !== undefined) {
        queryBuilder.where({ topic });
      }
    })
    .orderBy(sort_by, order)
    .then(rows => {
      let promiseArray = rows.map(row => {
        return connection
          .select("*")
          .from("comments")
          .where({ article_id: row.article_id });
      });
      return Promise.all([rows, ...promiseArray]);
    })
    .then(([rows, ...promiseArray]) => {
      let array = [rows, ...promiseArray];
      for (let i = 1; i < array.length; i++) {
        rows[i - 1].comment_count = array[i].length;
      }
      return rows;
    });

  // if (author !== undefined || topic !== undefined) {
  //   connectionToReturn.where({ author, topic });
  // }

  // return connectionToReturn;
};

module.exports = {
  fetchArticleById,
  updateArticleVotesById,
  createCommentByArticle,
  fetchCommentsByArticle,
  fetchArticles
};
