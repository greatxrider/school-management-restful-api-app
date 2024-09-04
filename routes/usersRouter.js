'use strict';

const express = require('express');

// Construct a router instance.
const usersRouter = express.Router();
const User = require('../models').User;

// Handler function to wrap each route.
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      // Forward error to the global error handler
      next(err);
    }
  };
}

// Route that returns a list of users.
usersRouter.get('/', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
}));

// Route that creates a new user.
usersRouter.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ messsage: 'Account successfully created!' });
  } catch (error) {
    console.log('ERROR: ', error.name);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

module.exports = usersRouter;
