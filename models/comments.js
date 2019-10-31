const connection = require("../db/connection");

const updateCommentVotes = (comment_id, inc_votes) => {
  return connection
    .select("votes")
    .from("comments")
    .where({ comment_id })
    .then(rows => {
      let oldVotes = parseInt(rows[0].votes);
      let newVotes = oldVotes + inc_votes;
      return connection("comments")
        .update({ votes: newVotes })
        .where({ comment_id })
        .returning("*");
    })
    .then(rows => {
      return rows[0];
    });
};

const removeComment = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .del();
};

module.exports = { updateCommentVotes, removeComment };
