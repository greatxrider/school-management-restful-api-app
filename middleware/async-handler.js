'use strict';

/**
 * Handler function to wrap each route.
 * @param {Function} cb - The callback function to wrap.
 * @returns {Function} - The wrapped function.
 */
exports.asyncHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    };
};
