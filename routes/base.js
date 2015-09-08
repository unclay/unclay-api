"use strict";
var base = require("./base");
var Model = require("./model");

// new Error
exports.err = function(opt) {
    var err = new Error();
    err.content = {};
    if (!!opt) {
        for (var i in opt) {
        	if( i === "code" || i === "message" ) err.content[i] = opt[i];
        	else err[i] = opt[i];
        }
    }
    return err;
}
// json格式化输出
exports.format = function(code, data){
	if( Object.prototype.toString.call(code) !== "[object Number]" ){
		data = code;
		code = 0;
	}
	return {
		"code": code,
		"data": data
	}
}
// 
exports.getQuery = function(req){
    return Object.prototype.toString.call(req.body) !== "[object Object]" ? req.query : 
            JSON.stringify(req.body) !== "{}" ? req.body : req.query;
}

exports.updateTotal = function(){

}