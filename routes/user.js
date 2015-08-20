"use strict";
var base = require("./base");
var Model = require("./model");

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
        }
    }
    // exportsFn.prototype.GET    = v2.GET;
    // exportsFn.prototype.POST   = v2.POST;
    // exportsFn.prototype.PUT    = v2.PUT;
    // exportsFn.prototype.DELETE = v2.DELETE;
exports.v1 = v1;
