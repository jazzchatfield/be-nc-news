const send405Error = (req, res, next) => {
  next({ status: 405, msg: "Method not allowed" });
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

module.exports = { send405Error, handleCustomErrors };
