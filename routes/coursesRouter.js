'use strict';

const express = require('express');

/**
 * Express router to mount course related functions on.
 * @type {Object}
 */
const coursesRouter = express.Router();
const { User, Course } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');
const { fetchCourseAndCheckOwnership } = require('../middleware/fetch-and-check');

/**
 * Route that returns a list of courses.
 * @name GET /api/courses
 * @function
 * @memberof module:routes/coursesRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
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

  /**
   * Route that creates a new course.
   * @name POST /api/courses
   * @function
   * @memberof module:routes/coursesRouter
   * @inner
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  .post(authenticateUser, asyncHandler(async (req, res) => {
    try {
      // Route that creates a new course.
      const course = await Course.create(req.body);
      // res.status(201).json({ message: 'Course successfully created!' });
      res.status(201).location(`/api/courses/${course.id}`).end();
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

/**
 * Route that returns the corresponding course including the user object associated with that course.
 */
coursesRouter.route('/:id')
  /**
  * GET /api/courses/:id
  * @summary Returns the course with the specified ID.
  * @param {Object} req - The request object.
  * @param {Object} res - The response object.
  */
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

  /**
   * PUT /api/courses/:id
   * @summary Updates the course with the specified ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
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

  /**
   * DELETE /api/courses/:id
   * @summary Deletes the course with the specified ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
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
