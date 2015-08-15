"use strict";
var base = require("./base");
var Model = require("./model");

var v1 = {
        GET: function(req, res, next) {
            var query = base.getQuery(req);
            var page = query.page || 1;
            var limit = query.limit || 10;
            var _temp = "";
            _temp = !!query.pid && query.pid.length !== 24 ? "参数pid有误" : "";
            if (!!_temp) {
                return next(base.err({
                    "code": 20100,
                    "from": "dict.tag.get.pid.error",
                    "message": _temp
                }));
            }
            _temp = {
                "type": "tag"
            };
            if (!!query.pid) _temp.pid = query.pid;
            if (!!query.status) _temp.status = {
                "$in": query.status.split(",")
            };
            else _temp.status = 0;
            Model.Msl.use(function(dbthen) {
                var q = Model.Dict
                    .find(_temp)
                    //.deepPopulate("pid")
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .sort({
                        "status": "asc",
                        "serial": "asc"
                    })
                    .exec();
                q.then(function(doc) {
                    res.send(base.format({
                        "page": page,
                        "limit": limit,
                        "list": doc
                    }));
                }).then(null, function(err) {
                    err = JSON.stringify(err).indexOf(query.pid) >= 0 ? "参数pid有误" : err;
                    dbthen(base.err({
                        "code": 20203,
                        "from": "Dict.tag.get.find",
                        "message": err
                    }));
                });
            }, function(err) {
                next(err);
            });
        },
        POST: function(req, res, next) {
            var query = base.getQuery(req);
            var _temp = "";
            _temp = !query.name ? "name参数是必须" :
                !query.alias ? "alias参数是必须" : "";
            if (!!_temp) {
                return next(base.err({
                    "code": 20100,
                    "from": "tag.post.valid.fields",
                    "message": _temp
                }));
            }
            _temp = {
                "name": query.name,
                "alias": query.alias,
                "type": "tag"
            };
            if (!!query.desc) _temp.desc = query.desc;
            if (!!query.pid) _temp.pid = query.pid;
            Model.Msl.use(function(dbthen) {
                var p = Model.Dict.findOne({
                    "type": "tag",
                    "name": query.name
                }).select("_id").exec();
                p.then(function(doc) {
                    if (!!doc) {
                        dbthen(base.err({
                            "code": 20205,
                            "from": "dict.tag.post.find.exists",
                            "message": "name: " + query.name + "已存在"
                        }));
                    } else {
                        return new Model.Dict(_temp).save();
                    }
                }).then(function(doc) {
                    doc && res.send(base.format(doc));
                }).then(null, function(err) {
                    console.log(err);
                    dbthen(base.err({
                        "code": 20200,
                        "from": "dict.tag.post.find|save",
                        "message": err
                    }));
                });
            }, function(err) {
                next(err);
            });
        },
        PUT: function(req, res, next) {
            var query = base.getQuery(req);
            var _temp = "";
            _temp = !query || !query._id ? "参数_id不能为空" :
                query._id.length !== 24 ? "参数_id有误" : "";
            if (!!_temp) {
                return next(base.err({
                    "code": 20100,
                    "from": "dict.tag.put.query",
                    "message": _temp
                }));
            }
            _temp = {};
            if (!!query.serial) _temp.serial = query.serial;
            if (!!query.name) _temp.name = query.name;
            if (!!query.alias) _temp.alias = query.alias;
            if (!!query.desc) _temp.desc = query.desc;
            if (!!query.status) _temp.status = query.status;
            if (JSON.stringify(_temp) === "{}") {
                return next(base.err({
                    "code": 20100,
                    "from": "dict.tag.put._temp",
                    "message": "没有需要修改的field"
                }));
            }
            _temp.updatetime = Date.now();
            Model.Msl.use(function(dbthen) {
                var p = Model.Dict.findOne({
                    "type": "tag",
                    "name": query.name,
                    "_id": {
                        "$ne": query._id
                    }
                }).select("_id").exec();

                p.then(function(doc) {
                    if (!!doc) {
                        return dbthen(base.err({
                            "code": 20205,
                            "from": "dict.tag.put.find.exists",
                            "message": "name: " + query.name + "已存在"
                        }));
                    } else {
                        return Model.Dict.findByIdAndUpdate(query._id, _temp).select("_id").exec();
                    }
                }).then(function(doc) {
                    if (!doc) {
                        return dbthen(base.err({
                            "code": 20100,
                            "from": "dict.tag.put.findByIdAndUpdate._id.error",
                            "message": "参数_id有误"
                        }));
                    }
                    return Model.Dict.findById(query._id).exec();
                }).then(function(doc) {
                    doc && res.send(base.format(doc));
                }).then(null, function(err) {
                    dbthen(base.err({
                        "code": 20200,
                        "from": "dict.tag.put.findByIdAndUpdate|findById",
                        "message": err
                    }));
                });
            }, function(err) {
                next(err);
            });
        },
        DELETE: function(req, res) {
            var query = base.getQuery(req);
            var _temp = "";
            _temp = !query || !query._id ? "参数_id不能为空" :
                query._id.length !== 24 ? "参数_id有误" : "";
            if (!!_temp) {
                return next(base.err({
                    "code": 20100,
                    "from": "dict.tag.delete.query",
                    "message": _temp
                }));
            }
            _temp = {};
            _temp.status = 2;
            Model.Msl.use(function(dbthen) {
                var p = Model.Dict.findOne({
                    "type": "tag",
                    "name": query.name,
                    "_id": {
                        "$ne": query._id
                    }
                }).select("_id").exec();
                var p = Model.Dict.findByIdAndUpdate(query._id, _temp).select("_id").exec();
                p.then(function(doc) {
                    console.log(doc);
                    if (!doc) {
                        return dbthen(base.err({
                            "code": 20100,
                            "from": "dict.tag.delete.findByIdAndUpdate._id.error",
                            "message": "参数_id有误"
                        }));
                    }
                    return Model.Dict.findById(query._id).exec();
                }).then(function(doc) {
                    doc && res.send(base.format(doc));
                }).then(null, function(err) {
                    dbthen(base.err({
                        "code": 20200,
                        "from": "dict.tag.delete.findByIdAndUpdate|findById",
                        "message": err
                    }));
                });
            }, function(err) {
                next(err);
            });
        }
    }
    // exportsFn.prototype.GET    = v2.GET;
    // exportsFn.prototype.POST   = v2.POST;
    // exportsFn.prototype.PUT    = v2.PUT;
    // exportsFn.prototype.DELETE = v2.DELETE;
exports.v1 = v1;
