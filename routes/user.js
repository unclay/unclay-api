"use strict";
var base = require("./base");
var Model = require("./model");

var v1 = {
        GET: function(req, res) {
            console.log(123);
        	Model.Msl.use(function(dbthen) {
                console.log(345)
                Model.User.find(function(err, doc) {
                    console.log(err, doc)
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
