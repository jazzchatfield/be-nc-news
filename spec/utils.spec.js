const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

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
  it("returns a new array containing converted timestamps when passed an array of one object", () => {
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
    let result = array[0]["created_at"];
    const expected = new Date(1542284514171);
    expect(result).to.eql(expected);
  });
  it("returns a new array containing converted timestamps when passed an array of multiple objects", () => {
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
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
