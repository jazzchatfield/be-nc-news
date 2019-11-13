const {
  fetchArticleById,
  updateArticleVotesById,
  createCommentByArticle,
  fetchCommentsByArticle,
  fetchArticles
} = require("../models/articles");

const getArticleById = (req, res, next) => {
  let { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticleVotesById = (req, res, next) => {
  let { inc_votes } = req.body;
  let { article_id } = req.params;
  updateArticleVotesById(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const postCommentByArticle = (req, res, next) => {
  let { article_id } = req.params;
  let { body, username } = req.body;
  createCommentByArticle(article_id, username, body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

const getCommentsByArticle = (req, res, next) => {
  let { article_id } = req.params;
  let { sort_by } = req.query;
  let { order } = req.query;

  if (sort_by === undefined) {
    sort_by = "created_at";
  }
  if (order === undefined) {
    order = "desc";
  }
  if (order !== "asc" && order !== "desc") {
    next({ status: 400, msg: "order_by invalid" });
  } else
    fetchCommentsByArticle(article_id, sort_by, order)
      .then(comments => {
        res.status(200).send({ comments });
      })
      .catch(next);
};

const getArticles = (req, res, next) => {
  let { sort_by, order, author, topic } = req.query;
  if (sort_by === undefined) {
    sort_by = "created_at";
  }
  if (order === undefined) {
    order = "desc";
  }
  if (order !== "asc" && order !== "desc") {
    next({ status: 400, msg: "order_by invalid" });
  }
  fetchArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

module.exports = {
  getArticleById,
  patchArticleVotesById,
  postCommentByArticle,
  getCommentsByArticle,
  getArticles
};
