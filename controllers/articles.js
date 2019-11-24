const {
  fetchArticleById,
  updateArticleVotesById,
  createCommentByArticle,
  fetchCommentsByArticle,
  fetchArticles,
  createArticle,
  removeArticle
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
  if (inc_votes === undefined) {
    inc_votes = 0;
  }
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
      res.status(201).send({ comment });
    })
    .catch(next);
};

const getCommentsByArticle = (req, res, next) => {
  let { article_id } = req.params;
  let { sort_by, order, limit, p } = req.query;

  if (sort_by === undefined) {
    sort_by = "created_at";
  }
  if (order === undefined) {
    order = "desc";
  }
  if (limit === undefined) {
    limit = 10;
  }
  if (p === undefined) {
    p = 0;
  }
  if (order !== "asc" && order !== "desc") {
    next({ status: 400, msg: "order_by invalid" });
  } else
    fetchCommentsByArticle(article_id, sort_by, order, limit, p)
      .then(([comments, total_count]) => {
        res.status(200).send({ comments, total_count });
      })
      .catch(next);
};

const getArticles = (req, res, next) => {
  let { sort_by, order, author, topic, limit, p } = req.query;
  if (sort_by === undefined) {
    sort_by = "created_at";
  }
  if (order === undefined) {
    order = "desc";
  }
  if (author === undefined) {
    author = "none";
  }
  if (topic === undefined) {
    topic = "none";
  }
  if (limit === undefined) {
    limit = 10;
  }
  if (p === undefined) {
    p = 0;
  }
  if (order !== "asc" && order !== "desc") {
    next({ status: 400, msg: "order_by invalid" });
  }
  fetchArticles(sort_by, order, author, topic, limit, p)
    .then(([articles, total_count]) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

const postArticle = (req, res, next) => {
  let { title, body, topic, username } = req.body;
  createArticle(title, body, topic, username)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  let { article_id } = req.params;
  removeArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = {
  getArticleById,
  patchArticleVotesById,
  postCommentByArticle,
  getCommentsByArticle,
  getArticles,
  postArticle,
  deleteArticle
};
