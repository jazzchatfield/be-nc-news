process.env.NODE_ENV = "test";

const request = require("supertest");
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");

const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
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
  });
  describe("/users", () => {
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
    });
  });
  describe("/articles", () => {
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
      it("PATCH 200 updates votes count and returns updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .set("Content-Type", "application/json")
          .send('{"inc_votes":"1"}')
          .expect(200)
          .then(res => {
            let result = res.body.updated.votes;
            let expected = 101;
            expect(result).to.equal(expected);
            expect(res.body.updated).to.have.keys(
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
      describe("/comments", () => {
        it("POST 200 posts new comment and returns posted comment", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .set("Content-Type", "application/json")
            .send('{"username":"lurker","body":"This is very good"}')
            .expect(200)
            .then(res => {
              expect(res.body.created).to.have.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
            });
        });
      });
    });
  });
});
