var express = require('express');
var router = express.Router();

/**
 * GET home page.
 * @name GET /
 * @function
 * @memberof module:routes/index
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get('/', function (req, res, next) {
    // setup a friendly greeting for the root route
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

module.exports = router;
