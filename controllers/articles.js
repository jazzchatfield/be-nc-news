const { fetchArticleById } = require("../models/articles");

const getArticleById = (req, res, next) => {
  let { article_id } = req.params;
  fetchArticleById(article_id).then(article => {
    res.status(200).send({ article });
  });
};

module.exports = { getArticleById };
