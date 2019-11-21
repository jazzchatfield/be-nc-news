const { fetchTopics, createTopic } = require("../models/topics");
const express = require("express");
const knex = require("knex");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  createTopic(slug, description)
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

module.exports = { getTopics, postTopic };
