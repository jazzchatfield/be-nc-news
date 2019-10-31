const { updateCommentVotes, removeComment } = require("../models/comments");

const patchCommentVotes = (req, res, next) => {
  let { comment_id } = req.params;
  let inc_votes = parseInt(req.body.inc_votes);
  updateCommentVotes(comment_id, inc_votes).then(updated => {
    res.status(200).send({ updated });
  });
};

const deleteComment = (req, res, next) => {
  let { comment_id } = req.params;
  removeComment(comment_id).then(() => {
    res.status(204).send();
  });
};

module.exports = { patchCommentVotes, deleteComment };
