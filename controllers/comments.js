const { updateCommentVotes, removeComment } = require("../models/comments");

const patchCommentVotes = (req, res, next) => {
  let { comment_id } = req.params;
  let { inc_votes } = req.body;
  if (inc_votes === undefined) {
    inc_votes = 0;
  }
  inc_votes = parseInt(inc_votes);
  updateCommentVotes(comment_id, inc_votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  let { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = { patchCommentVotes, deleteComment };
