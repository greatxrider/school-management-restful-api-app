'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.authenticateUser = async (req, res, next) => {
    let message;

    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: { emailAddress: credentials.name } });

        if (user) {
            console.log(`User found: ${user.emailAddress}`);
            console.log(`Credentials pass: ${credentials.pass}`);
            console.log(`User confirmedPassword: ${user.password}`);

            if (credentials.pass && user.password) {
                const authenticated = bcrypt.compareSync(credentials.pass, user.password);

                if (authenticated) {
                    console.log(`Authentication successful for username: ${user.emailAddress}`);
                    req.currentUser = user;
                } else {
                    message = `Authentication failure for username: ${user.emailAddress}`;
                }
            } else {
                message = 'Password or hash is missing';
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};
