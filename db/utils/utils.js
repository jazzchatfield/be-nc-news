// PREVIOUS MUTATING FORMATDATES UTIL

// exports.formatDates = list => {
//   return list.map(object => {
//     let unixTime = object.created_at;
//     let dateTime = new Date(unixTime);
//     delete object.created_at;
//     object.created_at = dateTime;
//     return object;
//   });
// };

// NEW HOPEFULLY NON MUTATING FORMATDATES UTIL

exports.formatDates = objectArray => {
  let newObjectArray = objectArray.map(object => {
    let newObj = { ...object };
    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
  return newObjectArray;
};

exports.makeRefObj = list => {
  let refObj = {};
  list.forEach(item => {
    refObj[item.title] = item.article_id;
  });
  return refObj;
};

// PREVIOUS MUTATING FORMATCOMMENTS UTIL

// exports.formatComments = (comments, articleRef) => {
//   let formattedComments = comments.map(comment => {
//     comment.author = comment.created_by;
//     delete comment.created_by;
//     comment.article_id = articleRef[comment.belongs_to];
//     delete comment.belongs_to;
//     comment.created_at = new Date(comment.created_at);
//     return comment;
//   });
//   return formattedComments;
// };

// NEW HOPEFULLY NOT MUTATING FORMATCOMMENTS UTIL

exports.formatComments = (comments, articleRef) => {
  let formattedCommentsArray = comments.map(comment => {
    let newObj = { ...comment };
    newObj.author = newObj.created_by;
    delete newObj.created_by;
    newObj.article_id = articleRef[newObj.belongs_to];
    delete newObj.belongs_to;
    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
  return formattedCommentsArray;
};
