"use strict";
var base = require("./base");
var Model = require("./model");
var crypto = require("crypto");

var v1 = {
        GET: function(req, res, next) {
            console.log(2);
        	var query = base.getQuery(req);
            console.log(1);
            Model.Msl.use(function(dbthen) {
                console.log(2);
                var q = Model.User
                    .find()
                    .exec();
                    console.log(3);
                q.then(function(doc) {
                    if( doc ){
                        res.send(base.format(doc));
                    } 
                }).then(null, function(err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "user.get.find",
                        "message": err+""
                    }));
                });
            }, function(err) {
                next(err);
            });
        },
        POST: function(req, res) {
            res.send("request is template v1 from POST");
        },
        PUT: function(req, res) {
            res.send("request is template v1 from PUT");
        },
        DELETE: function(req, res) {
            res.send("request is template v1 from DELETE");
        },
        login: function(req, res, next){
            var query = base.getQuery(req);
            var _temp = "";
            _temp = !query.name ? "name参数是必须" :
                !query.pass ? "pass参数是必须" : "";
            if (!!_temp) {
                return next(base.err({
                    "code": 20100,
                    "from": "login.post.valid.fields",
                    "message": _temp
                }));
            }
            _temp = {
                "name": query.name,
                "pass": crypto.createHash('md5').update( query.pass ).digest('base64')
            };
            Model.Msl.use(function(dbthen) {
                var p = Model.User
                    .findOne(_temp)
                    .select("email name showname role power")
                    .exec();
                p.then(function(doc) {
                    if( doc ){
                        req.session.user = doc;
                        console.log( req.sessionStore );
                        req.sessionStore.generate(function(err){
                            req.sessionStore.reload(function(err){
                                console.log(err);
                            })
                        })
                        console.log( req.session );
                        res.send(base.format(req.session));
                        
                    } else {
                        dbthen(base.err({
                            "code": 20400,
                            "from": "user.login.find",
                            "message": "用户不存在或密码错误"
                        }));
                    }
                }).then(null, function(err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "user.login.find",
                        "message": err+""
                    }));
                });
            }, function(err) {
                next(err);
            });
        },
        AUTH: function(req, res, next){
            var url = req.originalUrl;
            if (!req.session.user) {
                return res.redirect(Config.domain.SOURCE+"/admin/");
            } else {
                next();
            }
        }
    }
    // exportsFn.prototype.GET    = v2.GET;
    // exportsFn.prototype.POST   = v2.POST;
    // exportsFn.prototype.PUT    = v2.PUT;
    // exportsFn.prototype.DELETE = v2.DELETE;
exports.v1 = v1;
