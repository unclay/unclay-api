var v1 = function(req, res, txt){
	res.json({
		error_code: 20000,
		error_message: txt
	});
}
var exportsFn = function(txt){
	return function(req, res){
		v1(req, res, txt);
	}
}
//module.exports = exportsFn;
exports.onlyGET           = exportsFn("此API只支持GET方法");
exports.onlyPOST          = exportsFn("此API只支持POST方法");
exports.onlyPUT           = exportsFn("此API只支持PUT方法");
exports.onlyDELETE        = exportsFn("此API只支持DELETE方法");
exports.onlyGETPOST       = exportsFn("此API只支持GET、POST方法");
exports.onlyGETPUT        = exportsFn("此API只支持GET、PUT方法");
exports.onlyGETDELETE     = exportsFn("此API只支持GET、DELETE方法");
exports.onlyPOSTPUT       = exportsFn("此API只支持POST、PUT方法");
exports.onlyPOSTDELETE    = exportsFn("此API只支持POST、DELETE方法");
exports.onlyPUTDELETE     = exportsFn("此API只支持PUT、DELETE方法");
exports.onlyGETPOSTPUT    = exportsFn("此API只支持GET、POST、PUT方法");
exports.onlyGETPOSTDELETE = exportsFn("此API只支持GET、POST、DELETE方法");
exports.onlyGETPUTDELETE  = exportsFn("此API只支持GET、PUT、DELETE方法");
exports.onlyPOSTPUTDELETE = exportsFn("此API只支持POST、PUT、DELETE方法");
