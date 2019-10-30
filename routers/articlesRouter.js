const express = require("express");
const {
  getArticleById,
  patchArticleVotesById,
  postCommentByArticle
} = require("../controllers/articles");

const articlesRouter = express.Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotesById);

articlesRouter.post("/:article_id/comments", postCommentByArticle);

module.exports = articlesRouter;
