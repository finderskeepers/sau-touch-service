module.exports = function(app){
    var utils = require('../3th-party/utils');
    //
	var home = require('../app/controllers/home');
    var post = require('../app/controllers/post');
    //
	app.get('/', home.index);
    app.post('/auth', home.auth);
    app.post('/posts/', utils.secure, post.write);
    app.get('/posts/', utils.secure, post.posts);
    app.delete('/posts/:id', utils.secure, post.delete);
};
