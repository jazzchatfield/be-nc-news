const express = require("express");
const { patchCommentVotes, deleteComment } = require("../controllers/comments");
const { send405Error } = require("../errors/index");

const commentsRouter = express.Router();

commentsRouter.route("/").all(send405Error);

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteComment)
  .all(send405Error);

module.exports = commentsRouter;
