"use strict";
var base = require("./base");
var Model = require("./model");
var fs = require("fs");

var v1 = {
    User: function(cb_success, cb_error) {
    	Model.Msl.use(function(dbthen) {
            Model.User.find(function(err, doc) {
                if (err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "role.get.find",
                        "message": err
                    }));
                } else {
                	cb_success( doc );
                }
            });
        }, function(err){
            cb_error(err);
        });
    },
    Note: function(cb_success, cb_error) {
    	Model.Msl.use(function(dbthen) {
            Model.Note.find(function(err, doc) {
                if (err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "role.get.find",
                        "message": err
                    }));
                } else {
                	cb_success( doc );
                }
            });
        }, function(err){
            cb_error(err);
        });
    },
    Dict: function(cb_success, cb_error) {
    	Model.Msl.use(function(dbthen) {
            Model.Dict.find(function(err, doc) {
                if (err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "role.get.find",
                        "message": err
                    }));
                } else {
                	cb_success( doc );
                }
            });
        }, function(err){
            cb_error(err);
        });
    },
    File: function(cb_success, cb_error) {
    	Model.Msl.use(function(dbthen) {
            Model.File.find(function(err, doc) {
                if (err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "role.get.find",
                        "message": err
                    }));
                } else {
                	cb_success( doc );
                }
            });
        }, function(err){
            cb_error(err);
        });
    },
    Total: function(cb_success, cb_error) {
    	Model.Msl.use(function(dbthen) {
            Model.Total.find(function(err, doc) {
                if (err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "role.get.find",
                        "message": err
                    }));
                } else {
                	cb_success( doc );
                }
            });
        }, function(err){
            cb_error(err);
        });
    },
    Power: function(cb_success, cb_error) {
    	Model.Msl.use(function(dbthen) {
            Model.Power.find(function(err, doc) {
                if (err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "role.get.find",
                        "message": err
                    }));
                } else {
                	cb_success( doc );
                }
            });
        }, function(err){
            cb_error(err);
        });
    },
    Role: function(cb_success, cb_error) {
    	Model.Msl.use(function(dbthen) {
            Model.Role.find(function(err, doc) {
                if (err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "role.get.find",
                        "message": err
                    }));
                } else {
                	cb_success( doc );
                }
            });
        }, function(err){
            cb_error(err);
        });
    },
    Session: function(cb_success, cb_error) {
    	Model.Msl.use(function(dbthen) {
            Model.Session.find(function(err, doc) {
                if (err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "role.get.find",
                        "message": err
                    }));
                } else {
                	cb_success( doc );
                }
            });
        }, function(err){
            cb_error(err);
        });
    },
    recover: function(req, res, next){
    	var query = base.getQuery(req);
    	var time = query.time || "";
    	function strToJson(str){ 
            var json = eval('(' + str + ')'); 
            return json; 
        } 
    	var data = fs.readFileSync(__dirname + "/../static/backup/"+ time +".json", "utf-8");
    	try{
    		//data = strToJson( data );
    		data = JSON.parse(data);
    	} catch(err){
    		console.log(err);
    	}	
    	!!data.length && delete data.length;
    	!!data.elength && delete data.elength;
    	Model.Msl.use(function(dbthen) {
    		for( var i in data ){
    			if( i == 'user' ){
    				for( var j=0; j<data[i].length; j++ ){
    					new Model.User(data[j]).save();
    				}
    			} else if( i == 'note' ){
    				for( var j=0; j<data[i].length; j++ ){
    					new Model.Note(data[j]).save();
    				}
    				
    			} else if( i == 'dict' ){
    				for( var j=0; j<data[i].length; j++ ){
    					new Model.Dict(data[j]).save();
    				}
    				
    			} else if( i == 'file' ){
    				for( var j=0; j<data[i].length; j++ ){
    					new Model.File(data[j]).save();
    				}
    				
    			} else if( i == 'total' ){
    				for( var j=0; j<data[i].length; j++ ){
    					new Model.Total(data[j]).save();
    				}
    			} else if( i == 'session' ){
    				for( var j=0; j<data[i].length; j++ ){
    					new Model.Session(data[j]).save();
    				}
    			}
    		}
    		res.send("end");
    	});
    	
    },
    POST: function(req, res) {
        res.send("request is template v1 from POST");
    },
    PUT: function(req, res) {
        res.send("request is template v1 from PUT");
    },
    DELETE: function(req, res) {
        res.send("request is template v1 from DELETE");
    }
}
v1.update = function(type, data){
	Model.Msl.use(function(dbthen) {
        Model.Session.find(function(err, doc) {
                if (err) {
                    dbthen(base.err({
                        "code": 20203,
                        "from": "role.get.find",
                        "message": err
                    }));
                } else {
                	cb_success( doc );
                }
            });
        }, function(err){
            cb_error(err);
        });
}
v1.ALL = function(req, res){
	var data = {};
	data.length = 0;
	data.elength = 0;
	// 1
	v1.User(function(doc){
		data.length++;
		data.user = doc;
		v1.deal(req, res, data);
	}, function(err){
		data.elength++;
		v1.deal(req, res, data);
	});
	// 2
	v1.Note(function(doc){
		data.length++;
		
		for( var i=0; i<doc.length; i++ ){
			!!doc[i].content && delete doc[i].content;
		}
        data.note = doc;
		v1.deal(req, res, data);
	}, function(err){
		data.elength++;
		v1.deal(req, res, data);
	});
	// 3
	v1.Dict(function(doc){
		data.length++;
		data.dict = doc;
		v1.deal(req, res, data);
	}, function(err){
		data.elength++;
		v1.deal(req, res, data);
	});
	// 4
	v1.File(function(doc){
		data.length++;
		data.file = doc;
		v1.deal(req, res, data);
	}, function(err){
		data.elength++;
		v1.deal(req, res, data);
	});
	// 5
	v1.Total(function(doc){
		data.length++;
		data.total = doc;
		v1.deal(req, res, data);
	}, function(err){
		data.elength++;
		v1.deal(req, res, data);
	});
	// 6
	v1.Session(function(doc){
		data.length++;
		data.session = doc;
		v1.deal(req, res, data);
	}, function(err){
		data.elength++;
		v1.deal(req, res, data);
	});
}
v1.deal = function(req, res, data){
	if( data.length + data.elength == 6 ){
		var time = parseInt(new Date().getTime()/100000,10);
		fs.writeFile( __dirname + "/../static/backup/"+ time +".json", JSON.stringify(data), "utf-8", function(err, data,a){
			if( !err ) res.send("ok,"+time+".json");
			else res.send("err:"+err);
		} );
	} else if(data.elength > 0) res.send("error");
}
    // exportsFn.prototype.GET    = v2.GET;
    // exportsFn.prototype.POST   = v2.POST;
    // exportsFn.prototype.PUT    = v2.PUT;
    // exportsFn.prototype.DELETE = v2.DELETE;
exports.v1 = v1;
