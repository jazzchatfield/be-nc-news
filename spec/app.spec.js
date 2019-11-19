process.env.NODE_ENV = "test";

const request = require("supertest");
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");

const app = require("../app");
const connection = require("../db/connection");

chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/api", () => {
    it("GET 200 responds with array of endpoint objects", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(res => {
          expect(res.body.endpoints[0]).to.contain.keys(
            "name",
            "URL",
            "method",
            "responseKey",
            "accepts",
            "returns"
          );
        });
    });
    it("PATCH/POST/DELETE 405 method not allowed", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const promiseArray = invalidMethods.map(method => {
        return request(app)
          [method]("/api")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(promiseArray);
    });
  });
  describe("/topics", () => {
    it("GET 200 responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an("array");
          expect(res.body.topics[0]).to.contain.keys("slug", "description");
        });
    });
    it("PATCH/POST/DELETE 405 method not allowed", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const promiseArray = invalidMethods.map(method => {
        return request(app)
          [method]("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(promiseArray);
    });
  });
  describe("/users", () => {
    it("GET/PATCH/POST/DELETE 405 method not allowed", () => {
      const invalidMethods = ["get", "patch", "post", "delete"];
      const promiseArray = invalidMethods.map(method => {
        return request(app)
          [method]("/api/users")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(promiseArray);
    });
    describe("/:username", () => {
      it("GET 200 responds with user by username", () => {
        return request(app)
          .get("/api/users/lurker")
          .expect(200)
          .then(res => {
            expect(res.body.user).to.eql({
              username: "lurker",
              name: "do_nothing",
              avatar_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
            });
          });
      });
      it("GET 404 username not found", () => {
        return request(app)
          .get("/api/users/jasmine")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.eql("username not found");
          });
      });
      it("POST/PATCH/DELETE 405 method not allowed", () => {
        const invalidMethods = ["patch", "post", "delete"];
        const promiseArray = invalidMethods.map(method => {
          return request(app)
            [method]("/api/users/lurker")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(promiseArray);
      });
    });
  });
  describe("/articles", () => {
    it("GET 200 responds with articles when not provided queries", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(res.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET 200 responds with articles when provided sort_by queries", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          let parsedArticles = res.body.articles.map(article => {
            article.votes = parseInt(article.votes);
            return article;
          });
          expect(parsedArticles).to.be.sortedBy("votes");
        });
    });
    it("GET 200 responds with articles when provided an author query", () => {
      return request(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(res.body.articles[0].author).to.equal("butter_bridge");
        });
    });
    it("GET 200 responds with articles when provided a topic query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          expect(res.body.articles[0].topic).to.equal("mitch");
        });
    });
    it("GET 200 responds with articles when provided multiple queries", () => {
      return request(app)
        .get(
          "/api/articles?sort_by=votes&order=asc&author=butter_bridge&topic=mitch"
        )
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.have.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
          let parsedArticles = res.body.articles.map(article => {
            article.votes = parseInt(article.votes);
            return article;
          });
          expect(parsedArticles).to.be.sortedBy("votes");
          expect(res.body.articles[0].topic).to.equal("mitch");
          expect(res.body.articles[0].author).to.equal("butter_bridge");
        });
    });
    it("GET 200 responds with empty array when provided with a valid author that has no articles", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(0);
        });
    });
    it("GET 400 sort_by invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=sofjwfn")
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal("sort_by column does not exist");
        });
    });
    it("GET 400 order invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=blah")
        .expect(400)
        .then(res => expect(res.body.msg).to.equal("order_by invalid"));
    });
    it("GET 404 author does not exist", () => {
      return request(app)
        .get("/api/articles?author=aoifhgqpj")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("author does not exist");
        });
    });
    it("GET 404 topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=aoifhgqpj")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("topic does not exist");
        });
    });
    it("GET 404 author and topic do not exist", () => {
      return request(app)
        .get("/api/articles?author=aoifhgqpj&topic=igssdjs")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("author and topic do not exist");
        });
    });
    it("PATCH/POST/DELETE 405 method not allowed", () => {
      const invalidMethods = ["patch", "post", "delete"];
      const promiseArray = invalidMethods.map(method => {
        return request(app)
          [method]("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(promiseArray);
    });
    describe("/:article_id", () => {
      it("GET 200 responds with article by article_id", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(res => {
            expect(res.body.article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
          });
      });
      it("GET 400 invalid article id format", () => {
        return request(app)
          .get("/api/articles/oajfwi")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("invalid format");
          });
      });
      it("GET 404 no such article", () => {
        return request(app)
          .get("/api/articles/9284098")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("article does not exist");
          });
      });
      it("PATCH 200 updates votes count and returns updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .set("Content-Type", "application/json")
          .send('{"inc_votes":"1"}')
          .expect(200)
          .then(res => {
            let result = res.body.article.votes;
            let expected = 101;
            expect(result).to.equal(expected);
            expect(res.body.article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at"
            );
          });
      });
      it("PATCH 400 invalid article id format", () => {
        return request(app)
          .patch("/api/articles/sofhw")
          .set("Content-Type", "application/json")
          .send('{"inc_votes":"1"}')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("invalid format");
          });
      });
      it("PATCH 404 no such article", () => {
        return request(app)
          .patch("/api/articles/3498")
          .set("Content-Type", "application/json")
          .send('{"inc_votes":"1"}')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("article does not exist");
          });
      });
      it("PATCH 200 when not required info in body", () => {
        return request(app)
          .patch("/api/articles/1")
          .set("Content-Type", "application/json")
          .send('{"inc_vsdfbnotes":"5"}')
          .expect(200)
          .then(res => {
            expect(res.body.article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at"
            );
          });
      });
      it("POST/DELETE 405 method not allowed", () => {
        const invalidMethods = ["post", "delete"];
        const promiseArray = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles/1")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(promiseArray);
      });
      describe("/comments", () => {
        it("POST 201 posts new comment and returns posted comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .set("Content-Type", "application/json")
            .send('{"username":"lurker","body":"This is very good"}')
            .expect(201)
            .then(res => {
              expect(res.body.comment).to.have.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
            });
        });
        it("POST 400 body does not contain username and body", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .set("Content-Type", "application/json")
            .send('{"body":"This is very good"}')
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(
                "body does not contain all required information"
              );
            });
        });
        it("POST 404 article id does not exist", () => {
          return request(app)
            .post("/api/articles/138534342/comments")
            .set("Content-Type", "application/json")
            .send('{"username":"lurker","body":"This is very good"}')
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("article does not exist");
            });
        });
        it("POST 400 article id in wrong format", () => {
          return request(app)
            .post("/api/articles/fjklsn/comments")
            .set("Content-Type", "application/json")
            .send('{"username":"lurker","body":"This is very good"}')
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("invalid format");
            });
        });
        it("POST 404 username does not exist", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .set("Content-Type", "application/json")
            .send('{"username":"ofhwiohgs","body":"This is very good"}')
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("username does not exist");
            });
        });
        it("GET 200 returns array of comments for given article_id", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments[0]).to.have.keys(
                "comment_id",
                "votes",
                "created_at",
                "author",
                "body"
              );
            });
        });
        it("GET 200 empty array when article exists but has no comments", () => {
          return request(app)
            .get("/api/articles/3/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments.length).to.equal(0);
            });
        });
        it("GET 400 article_id invalid format", () => {
          return request(app)
            .get("/api/articles/ofieelkjf/comments")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("invalid format");
            });
        });
        it("GET 200 sorts by created_at as default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(res => {
              let parsedComments = res.body.comments.map(comment => {
                parseInt();
              });
              expect(res.body.comments).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("GET 400 value is too large", () => {
          return request(app)
            .get("/api/articles/3829048290/comments")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("value is too large");
            });
        });
        it("GET 404 article doesn't exist", () => {
          return request(app)
            .get("/api/articles/3829/comments")
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal("article does not exist");
            });
        });
        it("GET 200 takes sort_by and order queries", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author&order=asc")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.sortedBy("author");
            });
        });
        it("GET 400 order_by invalid", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author&order=blah")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("order_by invalid");
            });
        });
        it("GET 400 sort_by invalid column", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=blah&order=asc")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal("sort_by column does not exist");
            });
        });
        it("PATCH/DELETE 405 method not allowed", () => {
          const invalidMethods = ["patch", "delete"];
          const promiseArray = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/1/comments")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(promiseArray);
        });
      });
    });
  });
  describe("/comments", () => {
    it("GET/PATCH/POST/DELETE 405 method not allowed", () => {
      const invalidMethods = ["get", "patch", "post", "delete"];
      const promiseArray = invalidMethods.map(method => {
        return request(app)
          [method]("/api/comments")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(promiseArray);
    });
    describe("/:comment_id", () => {
      it("PATCH 200 responds with updated comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .set("Content-Type", "application/json")
          .send('{"inc_votes":"10"}')
          .expect(200)
          .then(res => {
            let result = res.body.comment.votes;
            let expected = 26;
            expect(result).to.equal(expected);
            expect(res.body.comment).to.have.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
          });
      });
      it("PATCH 400 comment_id invalid", () => {
        return request(app)
          .patch("/api/comments/flksjfs")
          .set("Content-Type", "application/json")
          .send('{"inc_votes":"10"}')
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("invalid format");
          });
      });
      it("PATCH 404 comment_id does not exist", () => {
        return request(app)
          .patch("/api/comments/3987")
          .set("Content-Type", "application/json")
          .send('{"inc_votes":"10"}')
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("comment does not exist");
          });
      });
      it("PATCH 200 when incorrect body is provided, returns the comment with no change", () => {
        return request(app)
          .patch("/api/comments/1")
          .set("Content-Type", "application/json")
          .send('{"skghslgh":"10"}')
          .expect(200)
          .then(res => {
            expect(res.body.comment).to.have.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
          });
      });
      it("DELETE 204 deletes given comment", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
      it("DELETE 400 comment_id invalid", () => {
        return request(app)
          .delete("/api/comments/fklhs")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("invalid format");
          });
      });
      it("DELETE 404 comment_id valid but doesn't exist", () => {
        return request(app)
          .delete("/api/comments/666")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("comment does not exist");
          });
      });
      it("GET/POST 405 method not allowed", () => {
        const invalidMethods = ["get", "post"];
        const promiseArray = invalidMethods.map(method => {
          return request(app)
            [method]("/api/comments/5")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(promiseArray);
      });
    });
  });
});
