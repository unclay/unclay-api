"use strict";
var base = require("./base");
var Model = require("./model");
var mongoose = require("mongoose");
var moment = require("moment");

var SESSIONS = {};
var KEY = "__clid";
var EXPIRES = 24 * 60 * 60;

var Middleware = function(options){
	var _this = this;
	_this.DEBUG = false;
	if( options ){
		KEY = options.key || KEY;
		EXPIRES = options.expires || EXPIRES;
		_this.DEBUG = options.debug === true ? true : false;
	}
	return function(req, res, next){
		req.KEY = KEY;
		req.EXPIRES = EXPIRES;
		req.session = {};
		_this.log("session.start");
		var session_id = req.cookies[KEY];
		if( !!session_id ){
			_this.log("session.start.exist.session_id: ", session_id);
			var session = SESSIONS[session_id];
			if( !!session && !!session.user ){
				_this.log("session.start.exist.session: ", session);
				if( session.cookie.expires > moment().unix() ){
					_this.log("session.start.expire.no.overdue", session.cookie.expires, moment().unix());
					session.cookie.expires = moment().unix() + EXPIRES;
					SESSIONS[session_id] = session;
					req.session = session;
					_this.updateCookie(req, res, session_id, session.cookie.expires);
					next();
				} else {
					_this.log("session.start.expire.overdue", session.cookie.expires, moment().unix());
					delete SESSIONS[session_id];
					_this.updateCookie(req, res, session_id, 10000);
					next();
				}
			} else {
				_this.log("session.start.no.exist.session");
				_this.findSessionByDb(req, res, next, session_id);
			}
		} else {
			_this.log("session.start.no.exist.session_id");
			next();
		}
	}
}
// 更新客户端cookie，当expires很小时清除客户端cookie
Middleware.prototype.updateCookie = function(req, res, session_id, expire){
	var host = req.headers.host.split(".");
		host = "."+host[host.length-2]+"."+host[host.length-1];
	res.setHeader('Set-Cookie', KEY+'='+session_id+';domain='+host+';path=/;Expires='+new Date(expire*1000).toGMTString()+';httpOnly=true');
}
// 生成新的session
Middleware.prototype.findSessionByDb = function(req, res, next, session_id){
	var _this = this;
	_this.log("session.start.findSessionByDb.session_id", session_id);
	Model.Msl.use(function(dbthen) {
		_this.log("session.start.findSessionByDb.start");
		var p = Model.Session.findById(session_id).exec();
		p.then(function(doc){
			_this.log("session.start.findSessionByDb.start.result", doc);
			if( !!doc ){
				_this.log("session.start.mongodb.exist.session: ", doc);
				if( doc.value.cookie.expires > moment().unix() ){
					_this.log("session.start.mongodb.expire.no.overdue", doc.value.cookie.expires, moment().unix());
					doc.value.cookie.expires = moment().unix() + EXPIRES;
					SESSIONS[session_id] = doc.value;
					req.session = doc.value;
					_this.updateCookie(req, res, session_id, doc.value.cookie.expire);
					next();
				} else {
					_this.log("session.start.mongodb.expire.overdue", doc.value.cookie.expires, moment().unix());
					_this.updateCookie(req, res, session_id, 10000);
					delete SESSIONS[session_id];
					next();
				}
			} else {
				_this.log("session.start.mongodb.no.exist.session");
				updateCookie(req, res, session_id, 10000);
				next();
			}
		}).then(null, function(err){
			dbthen(err);
		});
	}, function(err){
		_this.log("session.start.findSessionByDb.db.error", err);
		next();
	});
}
Middleware.prototype.log = function(){
	this.DEBUG && console.log.apply(null, arguments);
}
module.exports = Middleware;