const connection = require("../db/connection");

const updateCommentVotes = (comment_id, inc_votes) => {
  return connection
    .select("votes")
    .from("comments")
    .where({ comment_id })
    .then(rows => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "comment does not exist" });
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
  return connection
    .select("*")
    .from("comments")
    .where({ comment_id })
    .then(rows => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      }
      return connection("comments")
        .where({ comment_id })
        .del();
    });
};

module.exports = { updateCommentVotes, removeComment };
