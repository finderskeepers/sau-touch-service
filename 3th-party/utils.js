var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Nightmare = require('nightmare'),
    md5 = require('MD5'),
    randtoken = require('rand-token');

module.exports = {
    secure : function(req, res, next) {
        User.findOne({ "tokens.token": req.headers.token }, function(err, o){
            if(err) {
                throw new Error(err);
            } else {
                if(o === null) {
                    res.json({
                        result : "error",
                        data : "wrong_token"
                    });
                } else {
                    req.user_id = o._id;
                    next();
                }
            }
        });
    },
    doRegister : function(username, password, callback) {
        var that = this;
        //
        new Nightmare()
            .goto('https://sabis.sakarya.edu.tr/Login.aspx?site=ogr.sakarya.edu.tr&ReturnUrl=%2f')
            .type('input[id="txtUserName"]', username)
            .type('input[id="txtPassword"]', password)
            .click('#btnLogin')
            .wait()
            .evaluate(
            function() {
                var adSoyad = document.querySelector('span[id="ContentPlaceHolderOrtaAlan_ContentPlaceHolderIcerik_duyuru_lblOgrenciAdSoyad"]');
                var dogumTarihi = document.querySelector('span[id="ContentPlaceHolderOrtaAlan_ContentPlaceHolderIcerik_duyuru_lblDogumTarihi"]');
                var resim = document.querySelector('img[id="ContentPlaceHolderOrtaAlan_ContentPlaceHolderIcerik_duyuru_imgOgrenciFoto"]');
                var cinsiyet = document.querySelector('span[id="ContentPlaceHolderOrtaAlan_ContentPlaceHolderIcerik_duyuru_lblAskerlikDurumu"]');
                var fakulte = document.querySelector('span[id="ContentPlaceHolderOrtaAlan_ContentPlaceHolderIcerik_duyuru_lblFakulte"]');
                var bolum = document.querySelector('span[id="ContentPlaceHolderOrtaAlan_ContentPlaceHolderIcerik_duyuru_lblBolum"]');
                var ortalama = document.querySelector('span[id="ContentPlaceHolderOrtaAlan_ContentPlaceHolderIcerik_duyuru_lblOrtalama"]')
                //
                if(adSoyad == null || dogumTarihi == null || resim == null || fakulte == null || bolum == null || ortalama == null) {
                    return {
                        result : "error",
                        data : "incorrect_username_or_password"
                    };
                }
                return {
                    result : "success",
                    data : {
                        name : adSoyad.innerText,
                        born : dogumTarihi.innerText,
                        image : resim.src,
                        sex : cinsiyet ? "male" : "female",
                        faculty : fakulte.innerText,
                        department : bolum.innerText,
                        grade : ortalama.innerText
                    }
                };
            },
            function(o) {
                if(o.result === "success") {
                    return that.saveUser(username, password, o, function(result) {
                        callback(result);
                    });
                } callback(o);
            }
        ).run();
    },
    saveUser : function(username, password, o, callback) {
        var user = new User();
        var generatedToken = randtoken.generate(32);
        //
        user.username = username;
        user.password = md5(password);
        user.name = o.data.name;
        user.department = o.data.department;
        user.faculty = o.data.faculty;
        user.born = o.data.born;
        user.sex = o.data.sex;
        user.grade = parseFloat(o.data.grade.replace(",", "."));
        user.image = o.data.image;
        user.tokens.push({ token : generatedToken });
        //
        user.save(function(err, o) {
            if(err) {
                throw new Error(err);
            } else {
                callback({
                    result : "success",
                    data : {
                        name : o.name,
                        born : o.born,
                        image : o.image,
                        sex : o.sex,
                        faculty : o.faculty,
                        department : o.department,
                        grade : o.grade
                    },
                    token : generatedToken,
                    user_id : o._id
                });
            }
        });

    },
    checkUser : function(username, password, callback) {
        User.findOne({ "username" : username, "password" : md5(password) }, function(err, o) {
            if(err) {
                throw new Error(err);
            } else {
                if(o === null) {
                    callback(false);
                } else {
                    callback(o);
                }
            }
        });
    }
};