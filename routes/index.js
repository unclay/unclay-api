var moment = require("moment");
var R_test = require("./test");
var R_power = require("./power");
var R_role = require("./role");
var R_user = require("./user");
module.exports = function(app) {

    app.get("/api/v1/test", R_test.v1.GET);
    app.post("/api/v1/test", R_test.v1.POST);

    app.get("/api/v1/power", R_power.v1.GET);

    app.get("/api/v1/role", R_role.v1.GET);

    app.get("/api/v1/user", R_user.v1.GET);
}
