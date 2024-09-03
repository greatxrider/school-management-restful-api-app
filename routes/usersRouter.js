const express = require('express');
const usersRouter = express.Router();

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

/* GET users listing. */
usersRouter.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = usersRouter;
