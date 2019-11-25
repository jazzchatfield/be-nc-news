const apiEndpoints = (req, res, next) => {
  let endpoints = [
    {
      name: "GET /api",
      URL: "/api",
      method: "GET",
      responseKey: "endpoints",
      accepts: null,
      returns:
        "description of all available API endpoints with properties: name, URL, method, responseKey, accepts, returns"
    },
    {
      name: "GET /api/topics",
      URL: "/api/topics",
      method: "GET",
      responseKey: "topics",
      accepts: null,
      returns: "array of topic objects with properties: slug, description"
    },
    {
      name: "GET /api/users/:username",
      URL: "/api/users/:username",
      method: "GET",
      responseKey: "user",
      accepts: null,
      returns: "user object with properties: username, avatar_url, name"
    },
    {
      name: "GET /api/articles/:article_id",
      URL: "/api/articles/:article_id",
      method: "GET",
      responseKey: "article",
      accepts: null,
      returns:
        "article object with properties: author, title, article_id, body, topic, created_at, votes, comment_count"
    },
    {
      name: "PATCH /api/articles/:article_id",
      URL: "/api/articles/:article_id",
      method: "PATCH",
      responseKey: "article",
      accepts:
        "body object in the form { inc_votes: newVote } to increase or decrease the votes property by a certain amount",
      returns:
        "updated article object with properties: author, title, article_id, body, topic, created_at, votes"
    },
    {
      name: "POST /api/articles/:article_id/comments",
      URL: "/api/articles/:article_id/comments",
      method: "POST",
      responseKey: "comment",
      accepts: "body object with properties: username, body",
      returns:
        "posted comment with properties: username, body, comment_id, votes, created_at"
    },
    {
      name: "GET /api/articles/:article_id/comments",
      URL: "/api/articles/:article_id/comments",
      method: "GET",
      responseKey: "comments",
      accepts:
        "queries: sort_by (sorts by any valid column, defaults to created_at), order (asc or desc, defaults to desc), limit (number of results, defaults to 10), p (page number, defaults to 0)",
      returns:
        "a key of comments with an array of comments for the given article_id with properties: comment_id, votes, created_at, author, body, plus a key of total_count for the number of comments there are not considering the limit and p"
    },
    {
      name: "GET /api/articles",
      URL: "/api/articles",
      method: "GET",
      responseKey: "articles",
      accepts:
        "queries: sort_by (sorts by any valid column, defaults to date), order (asc or desc, defaults to desc), author, topic, limit (number of results, defaults to 10), p (page number, defaults to 0)",
      returns:
        "an object with a key of articles containing an array of article objects with properties: author, title, article_id, topic, created_at, votes, comment_count, plus a key of total_count for the number of articles there are not considering the limit and p"
    },
    {
      name: "PATCH /api/comments/:comment_id",
      URL: "/api/comments/:comment_id",
      method: "PATCH",
      responseKey: "comment",
      accepts:
        "body object in the form { inc_votes: newVote } to increase or decrease the votes property by a certain amount",
      returns:
        "updated comment object with properties: comment_id, votes, created_at, author, body"
    },
    {
      name: "DELETE /api/comments/:comment_id",
      URL: "/api/comments/:comment_id",
      method: "DELETE",
      responseKey: null,
      accepts: null,
      returns: null
    },
    {
      name: "POST /api/articles",
      URL: "/api/articles",
      method: "POST",
      responseKey: "article",
      accepts:
        "body object with keys {title, body, topic, username} where the username and topic must be existing",
      returns:
        "created article object with properties: article_id, title, body, votes, topic, author, created_at"
    },
    {
      name: "DELETE /api/articles/:article_id",
      URL: "/api/articles/:article_id",
      method: "DELETE",
      responseKey: null,
      accepts: null,
      returns: null
    },
    {
      name: "POST /api/topics",
      URL: "/api/topics",
      method: "POST",
      responseKey: "topic",
      accepts: "body object with keys {slug, description}",
      returns: "created topic object with properties: slug, description"
    },
    {
      name: "POST /api/users",
      URL: "/api/users",
      method: "POST",
      responseKey: "user",
      accepts:
        "body object with keys {name, username, avatar_url} where avatar_url is optional",
      returns: "created user object with properties: username, name, avatar_url"
    },
    {
      name: "GET /api/users",
      URL: "/api/users",
      method: "GET",
      responseKey: "users",
      accepts: null,
      returns:
        "array of user objects with properties: name, username, avatar_url"
    },
    {
      name: "DELETE /api/users/:username",
      URL: "/api/users/:username",
      method: "DELETE",
      responseKey: null,
      accepts: null,
      returns: null
    }
  ];
  res.status(200).send({ endpoints });
};

module.exports = apiEndpoints;
