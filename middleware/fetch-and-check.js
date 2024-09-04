const { asyncHandler } = require('./async-handler');
const { User, Course } = require('../models');

/**
 * Middleware to fetch course and check ownership.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.fetchCourseAndCheckOwnership = asyncHandler(async (req, res, next) => {
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
