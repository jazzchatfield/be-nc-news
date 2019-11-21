const express = require("express");
const {
  getArticleById,
  patchArticleVotesById,
  postCommentByArticle,
  getCommentsByArticle,
  getArticles,
  postArticle
} = require("../controllers/articles");
const { send405Error } = require("../errors/index");

const articlesRouter = express.Router();

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotesById)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticle)
  .get(getCommentsByArticle)
  .all(send405Error);

module.exports = articlesRouter;
