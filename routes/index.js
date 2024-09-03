var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // setup a friendly greeting for the root route
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

module.exports = router;
