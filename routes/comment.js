"use strict";
var base = require("./base");
var Model = require("./model");re("./model");

var v1 = {
        GET: function(req, res) {
        	Model.Msl.use(function(dbthen) {
                Model.Comment.find(function(err, doc) {
                    if (err) {
                        dbthen(base.err({
                            "code": 20203,
                            "from": "power.get.find",
                            "message": err
                        }));
                    } else {
                        res.send(base.format(doc));
                    }
                });
            }, function(err){
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
        }
    }
    // exportsFn.prototype.GET    = v2.GET;
    // exportsFn.prototype.POST   = v2.POST;
    // exportsFn.prototype.PUT    = v2.PUT;
    // exportsFn.prototype.DELETE = v2.DELETE;
exports.v1 = v1;
