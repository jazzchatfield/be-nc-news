exports.formatDates = list => {
  return list.map(object => {
    let unixTime = object.created_at;
    let dateTime = new Date(unixTime);
    delete object.created_at;
    object.created_at = dateTime;
    return object;
  });
};

exports.makeRefObj = list => {
  let refObj = {};
  list.forEach(item => {
    refObj[item.title] = item.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  let formattedComments = comments.map(comment => {
    comment.author = comment.created_by;
    delete comment.created_by;
    comment.article_id = articleRef[comment.belongs_to];
    delete comment.belongs_to;
    comment.created_at = new Date(comment.created_at);
    return comment;
  });
  return formattedComments;
};
