"use strict";
var base = require("./base");
var Model = require("./model");

var sessions = {};
var key = "__clid";
var EXPIRES = 24 * 60 * 60 * 1000;

var setEnd = function(req, res, next, session){
	var host = req.headers.host.split(".");
	host = "."+host[host.length-2]+"."+host[host.length-1];
	req.session = session;
	res.setHeader('Set-Cookie', key+'='+req.session.id+';domain='+host+';path=/;Expires='+new Date(req.session.cookie.expire).toGMTString()+';httpOnly=true');
	next();
}

var generate = function(req, res, next, sessionid){
	var session = {};
	session.id = sessionid || (new Date().getTime() + Math.random() + "");
	session.cookie = {
		expire: new Date().getTime() + EXPIRES
	};
	console.log("session8");
	Model.Msl.use(function(dbthen) {
		console.log("session9");
		var p = Model.Session.findOne({
			__clid: session.id
		}).exec();
		p.then(function(doc, err){
			if( doc ){
				session = doc.value;
				session.cookie.expire = new Date().getTime() + EXPIRES;
				sessions[session.id] = session;
                return setEnd(req, res, next, session);
			} else {
				session.id = new Date().getTime() + Math.random() + "";
            	return new Model.Session({
            		__clid: session.id,
            		value: session
            	}).save(function(err, doc){
					if (doc) {
		                sessions[session.id] = session;
		            	setEnd(req, res, next, session);
		            } else {
		            	dbthen();
		            }
				});
			}
		})
		.then(null, dbthen);
	}, function(err){
		next();
	});
}

module.exports = function(opt){
	if( opt ){
		key = opt.key || key;
		EXPIRES = opt.expires || EXPIRES;
	}
	return function(req, res, next){
		console.log("session1");
		var id = req.cookies[key];
		if(!id){
			console.log("session2");
			generate(req, res, next);
		} else {
			console.log("session3");
			var session = sessions[id];
			if( session ){
				console.log("session4");
				if( session.cookie.expire > new Date().getTime() ){
					console.log("session6");
					session.cookie.expire = new Date().getTime() + EXPIRES;
					setEnd(req, res, next, session);
				} else {
					console.log("session5");
					delete sessions[id];
					generate(req, res, next);
				}
			} else {
				console.log("session7");
				generate(req, res, next, id);
			}
		}
	}
}