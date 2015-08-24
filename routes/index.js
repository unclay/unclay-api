var moment = require("moment");
var R_test = require("./test");
var R_power = require("./power");
var R_role = require("./role");
var R_user = require("./user");
var R_tag = require("./tag");
var R_note = require("./note");
var R_comment = require("./comment");
var R_error = require("./error");
var R_file = require("./file");
var R_base = require("./base");
var R_redis = require("./redis");
module.exports = function(app) {
    app.all("/api/v1/*", function(req, res, next){
      if( !!req.headers.origin ){
        res.header("Access-Control-Allow-Origin", req.headers.origin.indexOf("localhost") >= 0 ? "http://localhost": req.headers.origin.indexOf("home.com") >= 0 ? "http://www.home.com": "http://www.unclay.com");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
        res.header("Access-Control-Allow-Credentials", true);
      }
      next();
    });

    app.get("/api/v1/test1", R_test.v1.SETSESSION);
    app.get("/api/v1/test2", R_test.v1.GETSESSION);
    app.get("/api/v1/test", R_test.v1.GET);
    app.post("/api/v1/test", R_test.v1.POST);

    app.route("/api/v1/power")
      .get(R_power.v1.GET);

    app.route("/api/v1/role")
      .get(R_role.v1.GET);

    app.route("/api/v1/user")
      .get(R_user.v1.GET);

    app.route("/api/v1/login")
      .post(R_user.v1.login);

    app.route("/api/v1/redis")
      .get(R_redis);

    app.route("/api/v1/note")
      .get(R_note.v1.GET)
      .post(R_note.v1.POST)
      .put(R_note.v1.PUT);

    app.route("/api/v1/note/:note_id")
      .get(R_note.v1.item.GET);

    app.route("/api/v1/tag")
      .get(R_tag.v1.GET)
      .post(R_tag.v1.POST)
      .put(R_tag.v1.PUT)
      .delete(R_tag.v1.DELETE);

    app.route("/api/v1/file")
      .get(R_file.v1.GET)
      .post(R_file.v1.POST);

    app.get("/api/v1/test/error", function(req, res, next){
    	var err = new Error();
    	err.content = {};
    	err.content.code = 10001;
    	err.content.message = "asdf"
    });

    app.use(R_error.createErrorProxy);
   	app.use(R_error.dealErrorProxy);
}

// method -> req.query