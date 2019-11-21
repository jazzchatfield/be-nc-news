const connection = require("../db/connection");

const fetchArticleById = article_id => {
  const getArticle = connection
    .select("*")
    .from("articles")
    .where({ article_id });
  const getComments = connection
    .select("*")
    .from("comments")
    .where({ article_id });
  return Promise.all([getArticle, getComments]).then(([article, comments]) => {
    if (article.length === 0) {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    } else {
      article[0].comment_count = comments.length;
      return article[0];
    }
  });
};

const updateArticleVotesById = (article_id, inc_votes) => {
  return connection
    .select("votes")
    .from("articles")
    .where({ article_id })
    .then(rows => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "article does not exist" });
      let oldVotes = parseInt(rows[0].votes);
      let newVotes = oldVotes + parseInt(inc_votes);
      return connection("articles")
        .update({ votes: newVotes })
        .where({ article_id })
        .returning("*");
    })
    .then(rows => {
      return rows[0];
    });
};

const createCommentByArticle = (article_id, username, body) => {
  let commentObj = { article_id, author: username, body };

  if (username === undefined || body === undefined) {
    return connection("comments")
      .insert(commentObj)
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  }
  let findArticle = connection("articles")
    .select("*")
    .where({ article_id });
  let findUsername = connection("users")
    .select("*")
    .where({ username });

  return Promise.all([findArticle, findUsername]).then(
    ([article, username]) => {
      if (article.length === 0 && username.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article and username do not exist"
        });
      } else if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      } else if (username.length === 0) {
        return Promise.reject({ status: 404, msg: "username does not exist" });
      } else
        return connection("comments")
          .insert(commentObj)
          .returning("*")
          .then(rows => {
            return rows[0];
          });
    }
  );
};

// OLD FETCHCOMMENTSBYARTICLE
// const fetchCommentsByArticle = (article_id, sort_by, order) => {
//   return connection
//     .select("*")
//     .from("comments")
//     .where({ article_id })
//     .orderBy(sort_by, order)
//     .then(rows => {
//       if (rows.length === 0) {
//         return Promise.reject({ status: 404, msg: "no comments found" });
//       }
//       return rows.map(row => {
//         delete row.article_id;
//         return row;
//       });
//     });
// };

// NEW FETCHCOMMENTSBYARTICLE
const fetchCommentsByArticle = (article_id, sort_by, order, limit, p) => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id })
    .then(rows => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      let grabCommentsPromise = connection
        .select("*")
        .from("comments")
        .where({ article_id })
        .limit(limit)
        .offset(p * limit)
        .orderBy(sort_by, order);

      let grabTotalPromise = connection
        .select("*")
        .from("comments")
        .where({ article_id });

      return Promise.all([grabCommentsPromise, grabTotalPromise]);
    })
    .then(([rows, total]) => {
      if (rows.length === 0) {
        return [rows, 0];
      }
      let newRows = rows.map(row => {
        let newObj = { ...row };
        delete newObj.article_id;
        return newObj;
      });
      let count = total.length;
      return [newRows, count];
    });
};

// OLD FETCHARTICLES WITH BASIC QUERIES
// const fetchArticles = (sort_by, order, author, topic) => {
//   return connection
//     .select("author", "title", "article_id", "topic", "created_at", "votes")
//     .from("articles")
//     .modify(function(queryBuilder) {
//       if (author !== undefined) {
//         queryBuilder.where({ author });
//       }
//       if (topic !== undefined) {
//         queryBuilder.where({ topic });
//       }
//     })
//     .orderBy(sort_by, order)
//     .then(rows => {
//       let promiseArray = rows.map(row => {
//         return connection
//           .select("*")
//           .from("comments")
//           .where({ article_id: row.article_id });
//       });
//       return Promise.all([rows, ...promiseArray]);
//     })
//     .then(([rows, ...promiseArray]) => {
//       let array = [rows, ...promiseArray];
//       for (let i = 1; i < array.length; i++) {
//         rows[i - 1].comment_count = array[i].length;
//       }
//       return rows;
//     })
//     .then(rows => {
//       if (rows.length === 0) {
//         return Promise.reject({
//           status: 404,
//           msg: "author or topic does not exist"
//         });
//       } else return rows;
//     });
// };

// NEW FETCHARTICLES WITH JOIN QUERY
const fetchArticles = (sort_by, order, author, topic, limit, p) => {
  let findAuthor = connection
    .select("*")
    .from("users")
    .where({ username: author })
    .then(rows => {
      return rows;
    });

  let findTopic = connection
    .select("*")
    .from("topics")
    .where({ slug: topic })
    .then(rows => {
      return rows;
    });

  let articleFinder = connection
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles", "comments")
    .limit(limit)
    .offset(p * limit)
    .count({ comment_count: "comments.article_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(function(queryBuilder) {
      if (author !== "none") {
        queryBuilder.where({ "articles.author": author });
      }
      if (topic !== "none") {
        queryBuilder.where({ "articles.topic": topic });
      }
    })
    .orderBy(sort_by, order)
    .then(rows => {
      return rows;
    });

  let getTotalCount = connection
    .select("*")
    .from("articles")
    .modify(function(queryBuilder) {
      if (author !== "none") {
        queryBuilder.where({ author });
      }
      if (topic !== "none") {
        queryBuilder.where({ topic });
      }
    })
    .orderBy(sort_by, order)
    .then(rows => {
      return rows.length;
    });

  if (author === "none" && topic === "none") {
    return Promise.all([articleFinder, getTotalCount]);
  }

  if (author !== "none" && topic === "none") {
    return findAuthor.then(rows => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "author does not exist" });
      } else return Promise.all([articleFinder, getTotalCount]);
    });
  }

  if (author === "none" && topic !== "none") {
    return findTopic.then(rows => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "topic does not exist" });
      } else return Promise.all([articleFinder, getTotalCount]);
    });
  }

  if (author !== "none" && topic !== "none") {
    return Promise.all([findTopic, findAuthor]).then(([topic, author]) => {
      if (topic.length === 0 && author.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "author and topic do not exist"
        });
      }
      if (topic.length === 0 && author.length !== 0) {
        return Promise.reject({
          status: 404,
          msg: "topic does not exist"
        });
      }
      if (author.length === 0 && topic.length !== 0) {
        return Promise.reject({
          status: 404,
          msg: "author does not exist"
        });
      }
      if (author.length !== 0 && topic.length !== 0) {
        return Promise.all([articleFinder, getTotalCount]);
      }
    });
  }
};

const createArticle = (title, body, topic, author) => {
  console.log(author);

  const articleObj = { title, body, topic, author };

  const creationPromise = connection
    .insert(articleObj)
    .into("articles")
    .returning("*");

  const findAuthor = connection
    .select("*")
    .from("users")
    .where({ username: author });

  const findTopic = connection
    .select("*")
    .from("topics")
    .where({ slug: topic });

  return Promise.all([findAuthor, findTopic])
    .then(([author, topic]) => {
      if (author.length === 0 && topic.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "author and topic not found"
        });
      } else if (author.length === 0) {
        return Promise.reject({ status: 404, msg: "author not found" });
      } else if (topic.length === 0) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      } else return creationPromise;
    })
    .then(rows => {
      return rows[0];
    });
};

const removeArticle = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id })
    .then(rows => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return connection
        .from("comments")
        .where({ article_id })
        .del();
    })
    .then(() => {
      return connection
        .from("articles")
        .where({ article_id })
        .del();
    });
};

module.exports = {
  fetchArticleById,
  updateArticleVotesById,
  createCommentByArticle,
  fetchCommentsByArticle,
  fetchArticles,
  createArticle,
  removeArticle
};
