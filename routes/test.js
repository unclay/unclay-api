"use strict";
var base = require("./base");
var Model = require("./model");
var os = require("os");

var v1 = {
        GET: function(req, res) {
            var d = new Date();
            res.send({
                date: new Date(),
                timestamp: new Date().getTime(),
                timezoneOffset: new Date().getTimezoneOffset(),
                os: os.uptime(),
                utc: Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), 0 ),
                utctime: new Date( Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), 0 ) )
            });
        },
        POST: function(req, res) {
        	
        },
        PUT: function(req, res) {
            res.send("request is template v1 from PUT");
        },
        DELETE: function(req, res) {
            res.send("request is template v1 from DELETE");
        },
        SETSESSION: function(req, res){
            req.session.setsession = "i am a session";
            console.log( req.session );
            console.log( req.cookie );
            res.send(req.session.setsession);
        },
        GETSESSION: function(req, res){
            console.log( req.session );
            console.log( req.cookie );
            console.log( req.sessionID );
            res.send(req.session);
        }
    }
    // exportsFn.prototype.GET    = v2.GET;
    // exportsFn.prototype.POST   = v2.POST;
    // exportsFn.prototype.PUT    = v2.PUT;
    // exportsFn.prototype.DELETE = v2.DELETE;
exports.v1 = v1;
