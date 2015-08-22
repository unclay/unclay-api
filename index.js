"use strict";
var express = require("express");
var os = require("os");
var path = require("path");
var jTemplate = require("juicer-template");
var bodyParser = require("body-parser");
// var cookieParser = require("cookie-parser");
// var cookieSession = require("cookie-session");
var session = require("express-session");
var RedisStore = require('connect-redis')(session);
var redis = require("redis");
var config = require("./config/config.json");
var routes = require("./routes");

// var client = redis.createClient(80, 'redis.duapp.com', {"no_ready_check":true});
// client.on("error", function (err) {
//  	console.log("Error " + err);
// });
// var username = 'vkGm0Ysdr6zxmn5cv1XrlfLB';          // 用户名（API KEY）
// var password = 'xrKVtSrLZeaj3VTx6lh1aQuXYUGFMs8t';  // 密码（Secret KEY）
// var db_host = 'redis.duapp.com';   
// var db_port = 80;
// var db_name = 'XssdPrZESAFIVpOFOzAf';               // 数据库名
// console.log(db_host);
// console.log(db_port);
// var options = {"no_ready_check":true};

// 建立连接后，在进行集合操作前，需要先进行auth验证

// client.auth(username + '-' + password + '-' + db_name);

var port = os.cpus()[0].model.indexOf("i5-4690") >= 0 ? 8085 : os.type().indexOf("Window") >= 0 ? 8012 : 18080;

var app = express();

app.set("port", port);
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "html");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(session({
// 	secret: "wcl",
// 	resave: true,
// 	saveUninitialized: true,
// 	cookie: {
// 		maxAge: 10000,
// 		domain:'.yourdomain.com'
// 	},
// 	store: new RedisStore({
// 	    host: "redis.duapp.com",
// 	    port: 80
// 	})
// }));
app.use(jTemplate({
	cache: false,
	domain: config.domain
}));
app.use("/thumbnail", express.static(__dirname+"/static/img/thumbnail"));
app.use("/t_thumbnail", express.static(__dirname+"/static/img/t_thumbnail"));

routes(app);

app.listen(app.get("port"), function() {
    console.log("listen to " + app.get("port"));
});

