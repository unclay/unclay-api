'use strict';
 var util = require("util");
 var mongoose = require("mongoose");
 
function DbKeeper() {
    this.db = mongoose.createConnection();
    this.open_count = 0;
}
DbKeeper.prototype.config = function(conf) {
    // body...
    
    conf = conf || {};
    this.host = conf.host || "localhost";
    this.port = conf.port || 27017;
    this.database = conf.database || "";
    this.options = {
        db: {
            native_parser: true
        },
        server: {
            poolSize: 4
        },
        user: conf.user || '',
        pass: conf.pass || ''
    };
 
 
    var constr = "";
    if(process.env.MONGO_DB_STR){
        constr = process.env.MONGO_DB_STR ;
    }
    else{
        //'mongodb://user:pass@localhost:port/database'
        constr = util.format('mongodb://%s:%s@%s:%d/%s', conf.userid,conf.password,conf.host,conf.port,conf.database);
    }
    this.dbUri = constr;
}
DbKeeper.prototype.open =function() {
 
    this.open_count++;
    if(this.open_count ==1 && this.db.readyState == 0)
    {        
        this.db.open(this.host, this.database, this.port, this.options, function() {
            // body...
            console.log("db opened");
        });
        this.db.on("error",function(err){
            console.log(err);
        });
    }
}
DbKeeper.prototype.close =function() {
 
    this.open_count--;
    if(this.open_count == 0 )
    {
        this.db.close(function(){
            //console.log("db closed");
        });
    }
}
DbKeeper.prototype.use = function(action,callback) {
    //OPEN
    var self = this;
    self.open();    
    action.call(null,function() {
        //CLOSE
        console.log("正在访问的数据库请求量"+self.open_count);
        self.close();
        callback.apply(null, arguments);
        //DONE
        self =null;
    })
};
 
exports = module.exports = new DbKeeper();