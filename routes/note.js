"use strict";
var base = require("./base");
var Model = require("./model");
var moment = require("moment");

var v1 = {
        GET: function(req, res, next) {
            var query = base.getQuery(req);;
            var page = query.page || 1;
            var limit = query.limit || 10;
        	Model.Msl.use(function(dbthen) {
                Model.Note
                    .find()
                    //.select("title intro author content createtime updatetime seo_url")
                    .skip( (page-1)*limit )
                    .limit(limit)
                    .sort({
                        updatetime: "desc"
                    }).exec(function(err, doc) {
                        if (err) {
                            dbthen(base.err({
                                "code": 20203,
                                "from": "note.get.find",
                                "message": err
                            }));
                        } else {
                            res.send(base.format({
                                "page": page,
                                "limit": limit,
                                "list": doc
                            }));
                        }
                    });
            }, function(err){
                next(err);
            });
        },
        POST: function(req, res, next) {
            var query = base.getQuery(req);
            var _temp = "";
            _temp = !query.title ? "title参数是必须" :
                !query.intro ? "intro参数是必须" :
                !query.content ? "content参数是必须" :
                !query.seo_url ? "seo_url参数是必须" : "";
            if (!!_temp) {
                return next(base.err({
                    "code": 20100,
                    "from": "note.post.valid.fields",
                    "message": _temp
                }));
            }
            _temp = {
                "title": query.title,
                "intro": query.intro,
                "content": query.content,
                "seo_url": query.seo_url,
                "user": [req.session.user._id]
            };

            if (!!query.thumbnail) _temp.thumbnail = query.thumbnail;
            if (!!query.tag) _temp.tag = query.tag;
            if (!!query.serial) _temp.serial = query.serial;
            if (!!query.seo_title) _temp.seo_title = query.seo_title;
            if (!!query.seo_keywords) _temp.seo_keywords = query.seo_keywords;
            if (!!query.seo_description) _temp.seo_description = query.seo_description;
            if (!!query.istop) _temp.istop = query.istop;
            if (!!query.user) _temp.user = query.user;
            Model.Msl.use(function(dbthen){
                var p = Model.Note.findOne({
                    "seo_url": query.seo_url
                }).select("_id").exec();
                p.then(function(doc){
                    if( !!doc ){
                        dbthen(base.err({
                            "code": 20205,
                            "from": "note.post.find.exists",
                            "message": "seo_url: " + query.seo_url + "已存在"
                        }));
                    } else {
                        return new Model.Note(_temp).save();
                    }
                }).then(function(doc){
                    v1.Total();
                    doc && res.send(base.format(doc));
                }).then(null, function(err){
                    dbthen(base.err({
                        "code": 20200,
                        "from": "note.post.find|save",
                        "message": err+""
                    }));
                });
            }, function(err){
                next(err);
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
            if ( JSON.stringify(_temp) === "{}" ) {
                return next(base.err({
                    "code": 20100,
                    "from": "note.put._temp",
                    "message": "没有需要修改的field"
                }));
            }
            _temp.updatetime = moment().unix();
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
                    v1.Total();
                    res.send(base.format(doc));
                }).then(null, function(err){
                    dbthen(base.err({
                        "code": 20200,
                        "from": "note.put.findByIdAndUpdate|findById",
                        "message": err+""
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
        },
        "Total": function(req, res, next){
            Model.Msl.use(function(dbthen) {
                var note = {};
                var p = Model.Note
                    .find()
                    .select("tag")
                    // .deepPopulate("tag", {
                    //     "populate": {
                    //         "tag": {
                    //             select: "type"
                    //         }
                    //     }
                    // })
                    .exec();
                p.then(function(data){
                    for( var i=0; i<data.length; i++ ){
                        for( var j=0; j<data[i].tag.length; j++ ){
                            note[data[i].tag[j]] = note[data[i].tag[j]] || [];
                            note[data[i].tag[j]].push(data[i]._id);
                        }
                    }
                    return Model.Dict
                        .find({
                            type: "tag",
                            status: 0
                        })
                        //.select("_id")
                        .exec();
                    
                }).then(function(tag){
                    var doc = [];
                    var _temp = {};
                    for(var i=0; i<tag.length; i++){
                        _temp = {
                            tagid: tag[i]._id,
                            name: tag[i].name,
                            type: "tag",
                            count: 0
                        }
                        if( note[tag[i]._id] && note[tag[i]._id].length > 0 ){
                            _temp.note = note[tag[i]._id];
                            _temp.count = note[tag[i]._id].length;
                        }
                        doc.push(_temp);
                    }
                    _temp = 0;
                    note = null;
                    var _save = function(){
                        Model.Total.findOne({
                            tagid: doc[_temp].tagid
                        }, function(err, result){
                            if( !!result ){
                                for( var i in doc[_temp] ){
                                    result[i] = doc[_temp][i];
                                }
                                result.save(function(){
                                    _temp++;
                                    if( _temp < doc.length ){
                                        _save();
                                    }
                                });
                            } else {
                                new Model.Total(doc[_temp]).save(function(){
                                    _temp++;
                                    if( _temp < doc.length ){
                                        _save();
                                    }
                                });
                            }
                           // console.log(a,b,c,d);
                            
                        })
                        // new Model.Total(doc[_temp]).save(function(result, err){
                        //     _temp++;
                        //     if( _temp < doc.length ){
                        //         _save();
                        //     }
                        // });
                    }
                    _save();
                    res && res.send(base.format(doc));
                }).then(null, function(err){
                    dbthen(base.err({
                        "code": 20203,
                        "from": "note.total.get.find",
                        "message": err+""
                    }));
                });
            }, function(err){
                next && next(err);
            });

        }
    }
    // exportsFn.prototype.GET    = v2.GET;
    // exportsFn.prototype.POST   = v2.POST;
    // exportsFn.prototype.PUT    = v2.PUT;
    // exportsFn.prototype.DELETE = v2.DELETE;
exports.v1 = v1;
