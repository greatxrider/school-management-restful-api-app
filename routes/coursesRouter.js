'use strict';

const express = require('express');

// Construct a router instance.
const { User, Course } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const coursesRouter = express.Router();

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

// Middleware to fetch course and check ownership
const fetchCourseAndCheckOwnership = asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
      },
    ],
  });

  if (course) {
    if (course.userId === req.currentUser.id) {
      req.course = course;
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

coursesRouter.route('/')
  .get(asyncHandler(async (req, res) => {
    // Route that returns a list of courses.
    const courses = await Course.findAll({
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
        },
      ],
    });

    res.status(200).json(courses);
    console.log(courses.map(course => course.get({ plain: true })));
  }))
  .post(authenticateUser, asyncHandler(async (req, res) => {
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
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
        },
      ],
    });

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  }))
  .put(authenticateUser, fetchCourseAndCheckOwnership, asyncHandler(async (req, res) => {
    try {
      await req.course.update(req.body);
      res.status(204).end();
    } catch (error) {
      console.log('ERROR: ', error.name);

      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(error => error.message);
        res.status(400).json({ errors });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }))
  .delete(authenticateUser, fetchCourseAndCheckOwnership, asyncHandler(async (req, res) => {
    try {
      await req.course.destroy();
      res.status(204).end();
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

module.exports = coursesRouter;
