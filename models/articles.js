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

module.exports = {
  fetchArticleById,
  updateArticleVotesById,
  createCommentByArticle
};
