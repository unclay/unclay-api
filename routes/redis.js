var redis = require('redis');
/*数据库连接信息host,port,user,pwd,dbname(可查询数据库详情页)*/
var username = 'wangchenglin';  //用户AK
var password = '123456';  //用户SK
var db_host = '192.168.1.114';   
var db_port = 6379;
var db_name = "";   //数据库名称
// var username = 'vkGm0Ysdr6zxmn5cv1XrlfLB';  //用户AK
// var password = 'xrKVtSrLZeaj3VTx6lh1aQuXYUGFMs8t';  //用户SK
// var db_host = 'redis.duapp.com';   
// var db_port = 80;
// var db_name = 'XssdPrZESAFIVpOFOzAf';   //数据库名称
console.log(db_host);
console.log(db_port);
var auth = !!username&&!!db_name ? username + '-' + password + '-' + db_name : password;
var options = {"no_ready_check":true};

function testRedis(req, res) {
	console.log(redis);
  var client = redis.createClient(db_port, db_host, options);
  client.on("error", function (err) {
    console.log("Error " + err);
  });

  // 建立连接后，在进行集合操作前，需要先进行auth验证
console.log( auth );
  client.auth(auth);

  client.set('baidu', 'welcome to BAE');

  client.get('baidu', function(err, result) {
    if (err) {
      console.log(err);
      res.end('get error');
      return;
    }
    res.send('result: ' + result);      
  }); 

}

module.exports = testRedis;
