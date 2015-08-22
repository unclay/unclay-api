var redis = require('redis');
/*数据库连接信息host,port,user,pwd,dbname(可查询数据库详情页)*/
var username = 'vkGm0Ysdr6zxmn5cv1XrlfLB';  //用户AK
var password = 'xrKVtSrLZeaj3VTx6lh1aQuXYUGFMs8t';  //用户SK
var db_host = 'redis.duapp.com';   
var db_port = 80;
var db_name = 'XssdPrZESAFIVpOFOzAf';   //数据库名称
console.log(db_host);
console.log(db_port);
var options = {"no_ready_check":true};

function testRedis(req, res) {
	console.log(redis);
  var client = redis.createClient(db_port, db_host, options);
  client.on("error", function (err) {
    console.log("Error " + err);
  });

  // 建立连接后，在进行集合操作前，需要先进行auth验证

  client.auth(username + '-' + password + '-' + db_name);

  client.set('baidu', 'welcome to BAE');

  client.get('baidu', function(err, result) {
    if (err) {
      console.log(err);
      res.end('get error');
      return;
    }
    res.end('result: ' + result);      
  }); 

}

module.exports = testRedis;
