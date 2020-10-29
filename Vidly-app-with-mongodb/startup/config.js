const config = require('config');

module.exports = function() {
    // Exit the process if the environment variable for jwtPrivateKey is not set
    if(!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }

}