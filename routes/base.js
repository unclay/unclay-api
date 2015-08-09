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