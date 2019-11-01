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
      if (article.err) next(article.err);
      else res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticleVotesById = (req, res, next) => {
  let { inc_votes } = req.body;
  let { article_id } = req.params;
  updateArticleVotesById(article_id, inc_votes)
    .then(updated => {
      if (updated.err) next(updated.err);
      else res.status(200).send({ updated });
    })
    .catch(next);
};

const postCommentByArticle = (req, res, next) => {
  let { article_id } = req.params;
  let { body, username } = req.body;
  createCommentByArticle(article_id, username, body)
    .then(created => {
      if (created.err) {
        next(created.err);
      } else res.status(200).send({ created });
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
  }
  fetchCommentsByArticle(article_id, sort_by, order)
    .then(comments => {
      if (comments.err) next(comments.err);
      else res.status(200).send({ comments });
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
      if (articles.length === 0) {
        next({ status: 400, msg: "author or topic does not exist" });
      } else res.status(200).send({ articles });
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
