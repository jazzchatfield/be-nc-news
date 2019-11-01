const send405Error = (req, res, next) => {
  next({ status: 405, msg: "Method not allowed" });
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

const handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "42703") {
    res.status(400).send({ msg: "sort_by column does not exist" });
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid format" });
  }
  if (err.code === "23502") {
    res
      .status(400)
      .send({ msg: "body does not contain all required information" });
  }
  if (err.code === "22003") {
    res.status(422).send({ msg: "value is too large" });
  }
};

module.exports = { send405Error, handleCustomErrors, handlePsqlErrors };
