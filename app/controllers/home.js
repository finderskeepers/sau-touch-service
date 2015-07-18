var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    utils = require('../../3th-party/utils'),
    randtoken = require('rand-token');

exports.index = function(req, res) {
    res.json({
        "version" : "1.0"
    });
};

exports.auth = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    //
    utils.checkUser(username, password, function(result) {
        if(result !== false) {
            var generatedToken = randtoken.generate(32);
            result.tokens.push({ token : generatedToken });
            //
            result.save(function(err, result) {
                if(err) {
                    throw new Error(err);
                } else {
                    res.json({
                        result : "success",
                        data : {
                            name : result.name,
                            born : result.born,
                            image : result.image,
                            sex : result.sex,
                            faculty : result.faculty,
                            department : result.department,
                            grade : result.grade
                        },
                        token : generatedToken,
                        user_id : result._id
                    });
                }
            });
        } else {
            utils.doRegister(username, password, function(result) {
                res.json(result);
            });
        }
    });
};