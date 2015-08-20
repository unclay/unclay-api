"use strict";
var express = require("express");
var os = require("os");
var path = require("path");
var jTemplate = require("juicer-template");
var bodyParser = require("body-parser");
// var cookieParser = require("cookie-parser");
// var cookieSession = require("cookie-session");
var session = require("express-session");
var config = require("./config/config.json");
var routes = require("./routes");


var port = os.cpus()[0].model.indexOf("i5-4690") >= 0 ? 8085 : os.type().indexOf("Window") >= 0 ? 8012 : 18080;

var app = express();

app.set("port", port);
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "html");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(cookieParser());
app.use(session({
	secret: "bae",
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 10000
	}
}));
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

