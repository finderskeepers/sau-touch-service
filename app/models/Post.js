var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
    content: String,
    date: { type: Date, default: Date.now }
});

mongoose.model('Post', PostSchema);

module.exports = PostSchema;