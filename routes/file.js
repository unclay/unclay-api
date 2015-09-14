"use strict";
var base = require("./base");
var Model = require("./model");
var path = require("path");
var Upload = require("./upload");
var fs = require("fs");
var domain = require("../config/config.json").domain;

var v1 = {
        GET: function(req, res, next) {
        	var query = base.getQuery(req);
        	var page = query.page || 1;
            var limit = query.limit || 10;
            var _temp = {};
            if(query.place) _temp.place = query.place;
            if(query.type) _temp.type = query.type;
            if( query.size && query.size.gt ){ _temp.size = _temp.size || {}; _temp.size["$gt"] = query.size.gt};
            if( query.size && query.size.lt ){ _temp.size = _temp.size || {}; _temp.size["$lt"] = query.size.lt};
        	Model.Msl.use(function(dbthen) {
                var q = Model.File
                    .find(_temp)
                    //.deepPopulate("pid")
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort({
                    	"_id": "desc"
                    })
                    .exec();
                q.then(function(doc) {
                    res.send(base.format({
                        "page": page,
                        "limit": limit,
                        "list": doc
                    }));
                }).then(null, function(err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "file.get.find",
                        "message": err
                    }));
                });
            }, function(err) {
                next(err);
            });
        },
        POST: function(req, res, next) {
        	try{
	            var up = new Upload({
					support: "png jpg gif"
				});
	        } catch(err){
	        	return next(base.err({
					"code": 20301,
                    "from": "file.put.new.upload",
                    "message": err
				}));
	        }
			up.start(req, function(data){
				data.path && delete data.path;
				res.json(base.format(data));
			}, function(err){
				next(base.err({
					"code": 20301,
                    "from": "file.put.upload",
                    "message": err
				}));
			});
        },
        PUT: function(req, res, next) {
            var query = base.getQuery(req);
            var _temp = "";
            _temp = !query || !query._id ? "参数_id不能为空" :
                    query._id.length !== 24 ? "参数_id有误" : "";
            if( !!_temp ){
                return next(base.err({
                    "code": 20100,
                    "from": "note.put.query",
                    "message": _temp
                }));
            }
            _temp = {};
            if (!!query.title) _temp.title = query.title;
            if (!!query.intro) _temp.intro = query.intro;
            if (!!query.content) _temp.content = query.content;
            if (!!query.seo_url) _temp.seo_url = query.seo_url;
            if (!!query.thumbnail) _temp.thumbnail = query.thumbnail;
            if (!!query.tag) _temp.tag = query.tag;
            if (!!query.serial) _temp.serial = query.serial;
            if (!!query.status) _temp.status = query.status;
            if (!!query.seo_title) _temp.seo_title = query.seo_title;
            if (!!query.seo_keywords) _temp.seo_keywords = query.seo_keywords;
            if (!!query.seo_description) _temp.seo_description = query.seo_description;
            if (!!query.istop) _temp.istop = query.istop;
            if (!!query.user) _temp.user = query.user;
            if ( JSON.stringify(_temp) === "{}" ) {
                return next(base.err({
                    "code": 20100,
                    "from": "note.put._temp",
                    "message": "没有需要修改的field"
                }));
            }
            _temp.updatetime = Date.now();
            Model.Msl.use(function(dbthen){
                var p = Model.Note.findByIdAndUpdate(query._id, _temp).exec();
                p.then(function(doc){
                    if( !doc ){
                        return dbthen(base.err({
                            "code": 20100,
                            "from": "note.put.findByIdAndUpdate._id.error",
                            "message": "参数_id有误"
                        }));
                    }
                    return Model.Note.findById(query._id).exec();
                }).then(function(doc){
                    res.send(base.format(doc));
                }).then(null, function(err){
                    dbthen(base.err({
                        "code": 20200,
                        "from": "note.put.findByIdAndUpdate|findById",
                        "message": err
                    }));
                });
            }, function(err){
                next(err);
            });
        },
        DELETE: function(req, res) {
            res.send("request is template v1 from DELETE");
        },
        "item": {
            GET: function(req, res, next){
                if( req.params.note_id.length !== 24 ){
                    return next(base.err({
                        "code": 20203,
                        "from": "note.item.get.note_id.length",
                        "message": req.params.note_id+"对应文章不存在"
                    }));
                }
                Model.Msl.use(function(dbthen) {
                    Model.Note
                        .findById(req.params.note_id)
                        //.select("title intro author content createtime updatetime seo_url")
                        .exec(function(err, doc) {
                            if (!!err || !doc) {
                                dbthen(base.err({
                                    "code": 20203,
                                    "from": "note.item.get.find",
                                    "message": req.params.note_id+"对应文章不存在"
                                }));
                            } else {
                                res.send(base.format(doc));
                            }
                        });
                }, function(err){
                    next(err);
                });
            }
        }
    }
    // exportsFn.prototype.GET    = v2.GET;
    // exportsFn.prototype.POST   = v2.POST;
    // exportsFn.prototype.PUT    = v2.PUT;
    // exportsFn.prototype.DELETE = v2.DELETE;
exports.v1 = v1;
