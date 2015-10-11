"use strict";
var base = require("./base");
var Model = require("./model");
var crypto = require("crypto");

var v1 = {
        GET: function(req, res, next) {
        	var query = base.getQuery(req);
            Model.Msl.use(function(dbthen) {
                // Model.User.find(function(err, doc){
                //     console.log(err, doc);
                // });
                var q = Model.User
                    .find()
                    .exec();
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
        POST: function(req, res, next) {
            try{
                var query = base.getQuery(req);
                var _temp = "";
                _temp = !query.name ? "name参数是必须" :
                    !query.pass ? "pass参数是必须" :
                    !query.email ? "email参数是必须" : "";
                if (!!_temp) {
                    return next(base.err({
                        "code": 20100,
                        "from": "user.post.valid.fields",
                        "message": _temp
                    }));
                }
                _temp = {
                    "name": query.name,
                    "showname": query.showname || query.name,
                    "pass": crypto.createHash('md5').update( query.pass ).digest('base64'),
                    "email": query.email
                };

                Model.Msl.use(function(dbthen){
                    var p = Model.User.findOne({
                        "name": query.name
                    }).select("_id").exec();
                    p.then(function(doc){
                        if( !!doc ){
                            dbthen(base.err({
                                "code": 20205,
                                "from": "user.post.find.exists",
                                "message": "用户名: " + query.name + "已存在"
                            }));
                        } else {
                            return new Model.User(_temp).save();
                        }
                    }).then(function(doc){
                        doc && res.send(base.format(doc));
                    }).then(null, function(err){
                        dbthen(base.err({
                            "code": 20200,
                            "from": "user.post.find|save",
                            "message": err+""
                        }));
                    });
                }, function(err){
                    next(err);
                });
            } catch(err){
                console.log(err);
            }
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
                        req.session.cookie = {
                            expires: new Date().getTime() + req.EXPIRES
                        };
                        return new Model.Session({
                            value: req.session
                        }).save();
                        // return Model.Session.update({
                        //     __clid: req.session.id
                        // }, {
                        //     value: req.session
                        // }).exec();
                        
                        
                    } else {
                        dbthen(base.err({
                            "code": 20400,
                            "from": "user.login.find",
                            "message": "用户不存在或密码错误"
                        }));
                    }
                }).then(function(doc){
                    if( !!doc ){
                        var host = req.headers.host.split(".");
                        host = "."+host[host.length-2]+"."+host[host.length-1];
                        res.setHeader('Set-Cookie', req.KEY+'='+doc._id+';domain='+host+';path=/;Expires='+new Date(doc.value.cookie.expires).toGMTString()+';httpOnly=true');
                        res.send(base.format(doc.value.user));
                    } else {
                        res.send(base.format("登陆失败"));
                    }
                    // if( !!data && data.ok == 1 ){
                    //     res.send(base.format(req.session.user));
                    // } else {
                    //     res.send(base.format("登陆失败"));
                    // }
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
        },
        member: function(req, res, next){
            console.log( req.session );
            if( !!req.session.user ){
                res.send(base.format(req.session.user));
            } else {
                res.send(base.err({
                    "code": 20000,
                    "from": "user.member.req.session.user",
                    "message": "用户未登录"
                }));
            }
        }
    }
    // exportsFn.prototype.GET    = v2.GET;
    // exportsFn.prototype.POST   = v2.POST;
    // exportsFn.prototype.PUT    = v2.PUT;
    // exportsFn.prototype.DELETE = v2.DELETE;
exports.v1 = v1;
