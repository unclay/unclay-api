# unclay
unclay

## 技术支持  
moment: http://momentjs.com/  
base: https://cnodejs.org/topic/504b4924e2b84515770103dd  
base: http://www.html5jq.com/fe/angular_node/20141230/29.html  
mongoose api: http://www.docs.ren/doc/553dd29410687af2252f9dcb#petitspois21  
mongoose api: http://mongoosejs.com/docs/api.html  

## 状态码  

### 正常码  

### 异常吗  
10502  
1 系统错误  
2 服务错误  
05 模块错误  
02 具体代码块错误  


20000 api不存在  
20100 参数是必须的  
20200 数据库异常  
20201 数据库增加异常  
20202 数据库删除异常  
20203 数据库查询异常  
20204 数据库修改异常  
20205 数据已存在
20300 文件上传异常
20301 图片上传异常
20400 用户不存在或密码错误

### linux shell
pm2 start index.js -i 0 --name api
pm2 restart api
pm2 stop api
pm2 show api
tail -f /home/vagrant/.pm2/logs/api-out-0.log -n 50
tail -f /home/vagrant/.pm2/logs/api-error-0.log

wget http://download.redis.io/releases/redis-3.0.3.tar.gz

netstat -anp | grep 8010
kill -s 9 pid
ps -ef | grep pm2