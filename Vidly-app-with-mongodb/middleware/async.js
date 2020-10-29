
// The route handler is passed as a reference and hence this function returns an async function
// The arguments - req, res and next are passed by the express.
// Therefore, all the routes are handled here and if any exception is thrown,
// it is passed to the error handler middleware
module.exports = function(handler) {
    return async(req, res, next) => {
        try {
            await handler(req, res);
        }
        catch(error) {
            next(error);
        }
    }
}