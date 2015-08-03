"use strict";
var Model = require("./model");
var msl = Model.Msl;
var v1 = {
        GET: function(req, res) {
            var power, role, user;
            msl.use(function() {
                Model.Power.find(msl.resolve());
            }).then(function(err, doc) {
                if (!!err) {
                    return msl.reject(err);
                }
                power = doc;
                Model.Role.find(msl.resolve());
            }).then(function(err, doc) {
                if (!!err) {
                    return msl.reject(err);
                }
                role = doc;
                Model.User.find(msl.resolve());
            }).then(function(err, doc) {
                if (!!err) {
                    return msl.reject(err);
                }
                user = doc;
                res.send(Model.format({
                    power: power,
                    role: role,
                    user: user
                }));
            }).catch(function(err) {
                res.send(Model.format(err));
            });
        },
        POST: function(req, res) {
        	var power, role, user;
            msl.use(function() {
                new Model.Power({
                    "name": "power-get",
                    "api": ["http://localhost:8012/api/v1/power"]
                }).save(msl.resolve());
            }).then(function(err, doc) {
            	if (!!err) {
                    return msl.reject(err);
                }
                power = doc;
                new Model.Role({
                    "name": "role-get",
                    "api": ["http://localhost:8012/api/v1/role"]
                }).save(msl.resolve());
            }).then(function(err, doc) {
            	if (!!err) {
                    return msl.reject(err);
                }
                role = doc;
                new Model.User({
                    "name": "user-get",
                    "api": ["http://localhost:8012/api/v1/user"]
                }).save(msl.resolve());
            }).then(function(err, doc) {
            	if (!!err) {
                    return msl.reject(err);
                }
                user = doc;
                res.send(Model.format({
                    power: power,
                    role: role,
                    user: user
                }));
            }).catch(function(err) {
                res.send(Model.format(err));
            });
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
