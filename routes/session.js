"use strict";
var base = require("./base");
var Model = require("./model");

var mongoose = require("mongoose");

var SESSIONS = {};
var KEY = "__clid";
var EXPIRES = 24 * 60 * 60 * 1000;

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
				if( session.cookie.expires > new Date().getTime() ){
					_this.log("session.start.expire.no.overdue", session.cookie.expires, new Date().getTime());
					session.cookie.expires = new Date().getTime() + EXPIRES;
					SESSIONS[session_id] = session;
					req.session = session;
					_this.updateCookie(req, res, session_id, session.cookie.expires);
					next();
				} else {
					_this.log("session.start.expire.overdue", session.cookie.expires, new Date().getTime());
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
	res.setHeader('Set-Cookie', KEY+'='+session_id+';domain='+host+';path=/;Expires='+new Date(expire).toGMTString()+';httpOnly=true');
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
				if( doc.value.cookie.expires > new Date().getTime() ){
					_this.log("session.start.mongodb.expire.no.overdue", doc.value.cookie.expires, new Date().getTime());
					doc.value.cookie.expires = new Date().getTime() + EXPIRES;
					SESSIONS[session_id] = doc.value;
					req.session = doc.value;
					_this.updateCookie(req, res, session_id, doc.value.cookie.expire);
					next();
				} else {
					_this.log("session.start.mongodb.expire.overdue", doc.value.cookie.expires, new Date().getTime());
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

// var setEnd = function(req, res, next, session){
// 	var host = req.headers.host.split(".");
// 	host = "."+host[host.length-2]+"."+host[host.length-1];
// 	req.session = session;
// 	res.setHeader('Set-Cookie', key+'='+req.session.id+';domain='+host+';path=/;Expires='+new Date(req.session.cookie.expire).toGMTString()+';httpOnly=true');
// 	next();
// }

// var generate = function(req, res, next, sessionid){
// 	var session = {};
// 	session.id = sessionid || (new Date().getTime() + Math.random() + "");
// 	session.cookie = {
// 		expire: new Date().getTime() + EXPIRES
// 	};
// 	Model.Msl.use(function(dbthen) {
// 		var p = Model.Session.findOne({
// 			__clid: session.id
// 		}).exec();
// 		p.then(function(doc, err){
// 			if( doc ){
// 				session = doc.value;
// 				session.cookie.expires = new Date().getTime() + EXPIRES;
// 				sessions[session.id] = session;
//                 return setEnd(req, res, next, session);
// 			} else {
// 				session.id = new Date().getTime() + Math.random() + "";
//             	return new Model.Session({
//             		__clid: session.id,
//             		value: session
//             	}).save(function(err, doc){
// 					if (doc) {
// 		                sessions[session.id] = session;
// 		            	setEnd(req, res, next, session);
// 		            } else {
// 		            	dbthen();
// 		            }
// 				});
// 			}
// 		})
// 		.then(null, dbthen);
// 	}, function(err){
// 		next();
// 	});
// }

// module.exports = function(opt){
// 	if( opt ){
// 		key = opt.key || key;
// 		EXPIRES = opt.expires || EXPIRES;
// 	}
// 	return function(req, res, next){
// 		var id = req.cookies[key];
// 		if(!id){
// 			generate(req, res, next);
// 		} else {
// 			var session = sessions[id];
// 			if( session ){
// 				if( session.cookie.expires > new Date().getTime() ){
// 					session.cookie.expires = new Date().getTime() + EXPIRES;
// 					setEnd(req, res, next, session);
// 				} else {
// 					delete sessions[id];
// 					generate(req, res, next);
// 				}
// 			} else {
// 				generate(req, res, next, id);
// 			}
// 		}
// 	}
// }