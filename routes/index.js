var moment = require("moment");
var R_test = require("./test");
var R_power = require("./power");
// var R_role = require("./role");
// var R_user = require("./user");
// var R_dict = require("./dict");
// var R_note = require("./note");
// var R_comment = require("./comment");
module.exports = function(app) {
	console.log("unix: "+moment().unix());
    app.get("/api/v1/test", R_test.v1.GET);
    app.post("/api/v1/test", R_test.v1.POST);

    app.get("/api/v1/power", R_power.v1.GET);
    app.get("/api/v1/power/", R_power.v1.GET);
    app.post("/api/v1/power", R_power.v1.POST);


    // app.get("/api/v1/role", R_role.v1.GET);

    // app.get("/api/v1/user", R_user.v1.GET);

    // app.get("/api/v1/dict", R_dict.v1.GET);

    // app.get("/api/v1/note", R_note.v1.GET);

    // app.get("/api/v1/comment", R_comment.v1.GET);

    app.get("/api/v1/test/error", function(req, res, next){
    	var err = new Error();
    	err.content = {};
    	err.content.code = 10001;
    	err.content.message = "asdf"
    });

   	app.use(function(err, req, res, next){
   		if( !!err ){
   			console.log("next-end");
   			if( err instanceof Error && !!err.content && err.content.code > 0 && !!err.content.message ){
	   			res.send(err.content);
	   		} else {
	   			res.send({
	   				"code": 10000,
	   				"message": "error than error",
	   				"is": {
	   					"isNotNull": !!err,
	   					"isError": err instanceof Error,
	   					"isContent": !!err && !!err.content,
	   					"isContentCode>0": !!err && !!err.content && err.content.code > 0,
	   					"isContentMessage": !!err && !!err.content && !!err.content.message
	   				}
	   			});
	   		}
   		} else {
   			next();
   		}
   	});
}

// method -> req.query