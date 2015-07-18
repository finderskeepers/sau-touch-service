var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = 'production';

var config = {
    production: {
        root: rootPath,
        app: {
            name: 'touch-api'
        },
        port: 1337,
        db: 'mongodb://wzzp.in/touch'
    }
};

module.exports = config[env];
