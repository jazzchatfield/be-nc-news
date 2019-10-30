const {
  fetchArticleById,
  updateArticleVotesById,
  createCommentByArticle
} = require("../models/articles");

const getArticleById = (req, res, next) => {
  let { article_id } = req.params;
  fetchArticleById(article_id).then(article => {
    res.status(200).send({ article });
  });
};

const patchArticleVotesById = (req, res, next) => {
  let { inc_votes } = req.body;
  let { article_id } = req.params;
  updateArticleVotesById(article_id, inc_votes).then(updated => {
    res.status(200).send({ updated });
  });
};

const postCommentByArticle = (req, res, next) => {
  let { article_id } = req.params;
  let { body, username } = req.body;
  createCommentByArticle(article_id, username, body).then(created => {
    res.status(200).send({ created });
  });
};

module.exports = {
  getArticleById,
  patchArticleVotesById,
  postCommentByArticle
};
