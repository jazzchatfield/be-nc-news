exports.formatDates = list => {
  return list.map(object => {
    let unixTime = object.created_at;
    let dateTime = new Date(unixTime);
    delete object.created_at;
    object.created_at = dateTime;
    return object;
  });
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
