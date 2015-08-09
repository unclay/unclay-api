"use strict";
var base = require("./base");
var Model = require("./model");
var v1 = {
        GET: function(req, res) {
            var query = req.query;

            Model.Msl.use(function(dbthen) {
                Model.Power.find(function(err, doc) {
                    if (err) {
                        return res.send(err);
                    } else {
                        return res.send(Model.format({
                            list: doc,
                            query: req.query,
                            params: req.params
                        }));
                    }
                });
            }, function(err, doc){

            });
        },
        POST: function(req, res, next) {
            var query = req.query;
            var _temp = "";
            _temp = !query.name ? "name参数是必须" :
                !query.api && !query.url ? "api或是url参数是必须的" : "";

            if (!!_temp) {
                next(base.err({
                    "code": 20100,
                    "from": "power.post.valid.params",
                    "message": _temp
                }));
                return false;
            }
            _temp = {
                "name": query.name
            };
            if (!!query.api) _temp.api = query.api;
            if (!!query.url) _temp.url = query.url;
            Model.Msl.use(function(dbthen){
            	var p = Model.Power.findOne({
            		"name": query.name
            	}).exec();
                p.then(function(doc){
					if( !!doc ){
						dbthen(base.err({
							"code": 20205,
							"from": "power.post.find",
							"message": query.name+"已存在"
						}));
                	} else {
                		return new Model.Power(_temp).save();
                	}
				}).then(function(doc){
                	res.send(base.format(doc));
                }).then(null, function(err){
                	dbthen(base.err({
						"code": 20200,
						"from": "power.post.find|save",
						"message": err
					}));
                });
            }, function(err){
            	next(err);
            });
        },
        PUT: function(req, res) {
            res.send("request is template v1 from PUT");
        },
        DELETE: function(req, res) {
            res.send("request is template v1 from DELETE");
        }
    }
// var exportsFn = function(){
// 	return this;
// }
// exportsFn.prototype.v1 = {};
// exportsFn.prototype.v1.GET    = v1.GET;
// exportsFn.prototype.v1.POST   = v1.POST;
// exportsFn.prototype.v1.PUT    = v1.PUT;
// exportsFn.prototype.v1.DELETE = v1.DELETE;
var ex = {};
ex.v1 = v1;
module.exports = ex;
