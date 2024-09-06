'use strict';

const express = require('express');

/**
 * Express router to mount course related functions on.
 * @type {Object}
 */
const usersRouter = express.Router();
const { User, Course } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');

/**
 * Route that returns a list of users.
 * @name GET /api/users
 * @function
 * @memberof module:routes/usersRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
usersRouter.get('/', authenticateUser, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.currentUser.id, {
    attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
    include: [
      {
        model: Course,
        as: 'courses',
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId']
      },
    ],
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
}));

/**
 * Route that creates a new user.
 * @name POST /api/users
 * @function
 * @memberof module:routes/usersRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
usersRouter.post('/', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    // res.status(201).json({ messsage: 'Account successfully created!' });
    res.status(201).location('/').end();
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
