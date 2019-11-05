process.env.NODE_ENV = "test";

const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");
const { commentData } = require("../db/data");

describe("formatDates", () => {
  it("returns a new array", () => {
    let array = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    let result = formatDates(array);
    expect(result).to.not.equal(array);
    expect(result).to.be.an("array");
  });
  it("returns a new array containing one object with a converted timestamp when passed an array of one object", () => {
    let array = formatDates([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
    let result = array[0];
    let expected = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1542284514171,
      votes: 100
    };
    expected.created_at = new Date(expected.created_at);
    expect(result).to.eql(expected);
  });
  it("returns a new array containing multiple objects with converted timestamps when passed an array of multiple objects", () => {
    let array = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171
      }
    ];
    let formattedArray = formatDates(array);
    let result1 = formattedArray[0]["created_at"];
    let result2 = formattedArray[1]["created_at"];
    let expected1 = new Date(1289996514171);
    let expected2 = new Date(1163852514171);
    expect(result1).to.eql(expected1);
    expect(result2).to.eql(expected2);
  });
  it("does not mutate the original data", () => {
    let dataToInput = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171
      }
    ];
    let originalData = { ...dataToInput[0] };
    formatDates(dataToInput);
    expect(dataToInput[0]).to.eql(originalData);
  });
});

describe("makeRefObj", () => {
  it("returns a new object when provided with an array of objects", () => {
    let list = [{ title: "hello", article_id: 55 }];
    let result = makeRefObj(list);
    expect(result).to.be.an("object");
  });
  it("returns a ref object when provided with an array of one object", () => {
    let list = [{ title: "hello", article_id: 55 }];
    let result = makeRefObj(list);
    let expected = { hello: 55 };
    expect(result).to.eql(expected);
  });
  it("returns a ref object when provided with an array of multiple objects", () => {
    let list = [
      { title: "hello", article_id: 55 },
      {
        title:
          "i have descended from the depths of hell to gift judgement unto the mortal world",
        article_id: 666
      },
      { title: "lol", article_id: 69 }
    ];
    let result = makeRefObj(list);
    let expected = {
      hello: 55,
      "i have descended from the depths of hell to gift judgement unto the mortal world": 666,
      lol: 69
    };
    expect(result).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("returns a new array", () => {
    let refObj = {
      hello: 55,
      "i have descended from the depths of hell to gift judgement unto the mortal world": 666,
      lol: 69
    };
    let unformattedComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "lol",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to:
          "i have descended from the depths of hell to gift judgement unto the mortal world",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "hello",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];
    let result = formatComments(unformattedComments, refObj);
    expect(result).to.not.equal(unformattedComments);
    expect(result).to.be.an("array");
  });
  it("formats a single comment when provided one comment in an array", () => {
    let singleCommentArray = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "lol",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    let refObj = {
      hello: 55,
      "i have descended from the depths of hell to gift judgement unto the mortal world": 666,
      lol: 69
    };
    let result = formatComments(singleCommentArray, refObj);
    let expected = {
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 69,
      author: "butter_bridge",
      votes: 16,
      created_at: new Date(1511354163389)
    };
    expect(result[0]).to.eql(expected);
  });
  it("formats multiple comments when provided with multiple comments in an array", () => {
    let refObj = {
      hello: 55,
      "i have descended from the depths of hell to gift judgement unto the mortal world": 666,
      lol: 69
    };
    let unformattedComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "lol",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to:
          "i have descended from the depths of hell to gift judgement unto the mortal world",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "hello",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];
    let result = formatComments(unformattedComments, refObj);
    let expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 69,
        author: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 666,
        author: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        article_id: 55,
        author: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];
    expected.forEach(comment => {
      comment.created_at = new Date(comment.created_at);
    });
    expect(result).to.eql(expected);
  });
  it("does not mutate the original data", () => {
    let refObj = {
      hello: 55,
      "i have descended from the depths of hell to gift judgement unto the mortal world": 666,
      lol: 69
    };
    let unformattedComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "lol",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to:
          "i have descended from the depths of hell to gift judgement unto the mortal world",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
        belongs_to: "hello",
        created_by: "icellusedkars",
        votes: 100,
        created_at: 1448282163389
      }
    ];
    let originalData = { ...unformattedComments[0] };
    formatComments(unformattedComments, refObj);
    expect(unformattedComments[0]).to.eql(originalData);
  });
});
