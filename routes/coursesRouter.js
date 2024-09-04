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

coursesRouter.route('/')
  .get(asyncHandler(async (req, res) => {
    // Route that returns a list of courses.
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
  }))
  .post(asyncHandler(async (req, res) => {
    try {
      // Route that creates a new course.
      await Course.create(req.body);
      res.status(201).json({ message: 'Course successfully created!' });
    } catch (error) {
      console.log('ERROR: ', error.name);

      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(error => error.message);
        res.status(400).json({ errors });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }));

// Route that returns the corresponding course including the user object associated with that course
coursesRouter.route('/:id')
  .get(asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  }))
  .put(asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (course) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  }))
  .delete(asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  }));

module.exports = coursesRouter;
