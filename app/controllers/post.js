var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    utils = require('../../3th-party/utils');

exports.write = function(req, res) {
    var id = req.user_id;
    var content = req.body.content;
    //
    User.findOne({ _id : id }, function(err, o) {
        o.posts.push({ content : content });
        o.save(function(err, result) {
            if(err) {
                throw new Error(err);
            } else {
                res.json({
                    result : "success"
                });
            }
        });
    });
};

exports.posts = function(req, res) {
    User.find(function(err, o) {
        var arr = [];
        for(var i = 0; i < o.length; i++) {
            for(var j = 0; j < o[i].posts.length; j++) {
                arr.push({
                    id : o[i].posts[j]._id,
                    user_id : o[i]._id,
                    content : o[i].posts[j].content,
                    date : o[i].posts[j].date
                });
            }
        }
        //
        arr.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        res.json(arr);
    });
};

exports.delete = function(req, res) {
    var user_id = req.user_id;
    var id = req.param("id");
    //
    User.findOne({ "posts._id" : id, "_id" : user_id }, function(err, o) {
        if(err) {
            throw new Error(err);
        } else {
            for(var i = 0; i < o.posts.length; i++) {
                if(id == o.posts[i]._id) {
                    console.log("hi");
                    o.posts.splice(o.posts.indexOf(i), 1);
                    console.log(o.posts);
                    o.save(function(err, o) {
                        res.json({
                            result : "success"
                        });
                    });
                }
            }
        }
    });
};