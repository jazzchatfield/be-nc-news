const send405Error = (req, res, next) => {
  next({ status: 405, msg: "Method not allowed" });
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

const handlePsqlErrors = (err, req, res, next) => {
  const errors = {
    42703: { status: 400, msg: "sort_by column does not exist" },
    "22P02": { status: 400, msg: "invalid format" },
    "23502": {
      status: 400,
      msg: "body does not contain all required information"
    },
    "22003": { status: 400, msg: "value is too large" }
  };
  if (errors[err.code]) {
    res.status(errors[err.code].status).send({ msg: errors[err.code].msg });
  }
};

const handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};

module.exports = {
  send405Error,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors
};
