var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Post = mongoose.model('Post'),
    Token = mongoose.model('Token');

var PostSchema = require("./Post");
var TokenSchema = require("./Token");

var UserSchema = new Schema({
    username: String,
    password: String,
    name: String,
    department: String,
    faculty: String,
    born: String,
    sex: String,
    grade: Number,
    image: String,
    posts: [PostSchema],
    tokens: [TokenSchema]
});

mongoose.model('User', UserSchema);

module.exports = UserSchema;
