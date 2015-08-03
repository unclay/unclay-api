"use strict";
var express = require("express");
var os = require("os");
var path = require("path");
var jTemplate = require("juicer-template");

var config = require("./config/config.json");
var routes = require("./routes");


var port = os.cpus()[0].model.indexOf("i5-4690") >= 0 ? 8085 : os.type().indexOf("Window") >= 0 ? 8012 : 18080;

var app = express();

app.set("port", port);
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "html");
app.use(jTemplate({
	cache: false,
	domain: config.domain
}));


routes(app);

app.listen(app.get("port"), function() {
    console.log("listen to " + app.get("port"));
});

