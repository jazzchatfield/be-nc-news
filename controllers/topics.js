const { fetchTopics } = require("../models/topics");
const express = require("express");
const knex = require("knex");

const getTopics = (req, res, next) => {
  fetchTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

module.exports = { getTopics };
