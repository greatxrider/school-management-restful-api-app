'use strict';

const express = require('express');

// Construct a router instance.
const coursesRouter = express.Router();
const { User, Course } = require('../models');

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
coursesRouter.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: 'user',
      },
    ],
  });
  res.status(200).json(courses);
  console.log(courses.map(course => course.get({ plain: true })));
}));

// Route that returns the corresponding course including the user object associated with that course
coursesRouter.get('/api/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'user',
      },
    ],
  });
  res.status(200).json(course);
}))

// Route that creates a new user.
coursesRouter.post('/', asyncHandler(async (req, res) => {
  try {
    await Course.create(req.body);
    res.status(201).json({ message: 'Account successfully created!' });
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

module.exports = coursesRouter;
