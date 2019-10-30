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
    article[0].comment_count = comments.length;
    console.log(article[0].comment_count);
    return article[0];
  });

module.exports = { fetchArticleById };
