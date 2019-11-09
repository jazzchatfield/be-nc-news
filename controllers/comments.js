const { updateCommentVotes, removeComment } = require("../models/comments");

const patchCommentVotes = (req, res, next) => {
  let { comment_id } = req.params;
  let inc_votes = parseInt(req.body.inc_votes);
  updateCommentVotes(comment_id, inc_votes)
    .then(updated => {
      res.status(200).send({ updated });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  let { comment_id } = req.params;
  removeComment(comment_id)
    .then(deleted => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = { patchCommentVotes, deleteComment };
