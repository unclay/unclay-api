var crypto = require("crypto")
	, path = require("path")
	, fs = require("fs")
	, util = require('util')
	, moment = require('moment')
	, images = require("images")
	, formidable = require('formidable');
var base = require("./base");
var Model = require("./model");

var Uploads = function(opt){
	var _this = this;
	_this.filename = opt.filename || moment().format("YYYYMMDDHHmmssSSSS");
	_this.support = !!opt.support ? opt.support.split(" ") : [];
	_this.form = new formidable.IncomingForm({});
	_this.form.uploadDir = path.join(process.cwd(), "static");
	// console.log( fs.existsSync(_this.form.uploadDir) );
	// if( !fs.existsSync(_this.form.uploadDir) ){
	// 	fs.mkdirSync(_this.form.uploadDir);
	// 	fs.mkdirSync(_this.form.uploadDir+"/img");
	// 	fs.mkdirSync(_this.form.uploadDir+"/img/other");
	// } else if( !fs.existsSync(_this.form.uploadDir+"/img") ){
	// 	fs.mkdirSync(_this.form.uploadDir+"/img");
	// 	fs.mkdirSync(_this.form.uploadDir+"/img/other");
	// } else if( !fs.existsSync(_this.form.uploadDir+"/img/other") ){
	// 	fs.mkdirSync(_this.form.uploadDir+"/img/other");
	// }
	_this.form.uploadDir = path.join(process.cwd(), "static/img/other");
	return _this;
}
Uploads.prototype.start = function(req, fn1, fn2){
	var _this = this;
	_this.form.parse(req, function(err, fields, files) {
	    err = !!err ? err : 
	    		(JSON.stringify(fields) === "{}" || !fields.place) ? "参数place不能为空" :
	    		fields.place !== "thumbnail" ? "参数place不正确" :
	    		(JSON.stringify(files) === "{}" || !files.file || !files.file.type) ? "参数file不能为空": "";
	    if(err){
	    	return fn2 ? fn2(err) : console.error(err);
	    }
	    Model.Msl.use(function(dbthen) {
	    	var p = Model.File.findOne({
	    		"type": files.file.type,
	    		"upload_name": decodeURI( files.file.name ),
	    		"size": files.file.size,
	    		"place": fields.place
	    	}).exec();
	    	p.then(function(doc){
	    		if( !!doc ){
	    			fs.unlinkSync(path.join(files.file.path+"") );
	    			return fn2 ? fn2("文件已存在，不能再次上传") : console.error("文件已存在，不能再次上传");
	    		} else {
	    			if( fields.place === 'thumbnail' ){
			    	_this.form.uploadDir = path.join(process.cwd(), "static/img/thumbnail");
			    }
		    	switch (files.file.type) {
			    	case 'image/pjpeg':
						_this.extName = 'jpg';
						break;
					case 'image/jpeg':
						_this.extName = 'jpg';
						break;		 
					case 'image/png':
						_this.extName = 'png';
						break;
					case 'image/x-png':
						_this.extName = 'png';
						break;
					default:
						_this.extName = files.file.type;	 
				}
				for( var i=0; i<_this.support.length; i++ ){
					if( _this.extName == _this.support[i] ){
						break;
					} else if( i == _this.support.length-1 ){
						fs.unlinkSync( path.join(files.file.path+"") );
						return fn2 ? fn2("不支持"+_this.extName+"的类型文件上传") : console.error(extName+"的类型文件上传");
					}
				}
				avatarName = (fields.id || _this.filename) +"."+_this.extName;  
			    var newPath = path.join(_this.form.uploadDir+"/"+avatarName);
			    fs.renameSync(path.join(files.file.path+""), newPath);  //重命名
			    	

			    if( fields.place === "thumbnail" ){
			    	var img = images(newPath);
		            img.size(img.width()/3)                       
				    	.save(path.join(_this.form.uploadDir.replace(fields.place, "t_"+fields.place)+"/"+avatarName), {               //Save the image to a file,whih quality 50
        					quality : 50                    //保存图片到文件,图片质量为50
    					});
			    }
			    
		  		
	    		}
	    		return new Model.File({
		    		"file_name": avatarName,
		    		"type": files.file.type,
		    		"upload_name": decodeURIComponent( files.file.name ),
		    		"size": files.file.size,
		    		"place": fields.place
		    	}).save();
		    	
	    	}).then(function(doc){
	    		if(fn1 && doc){
		  			fn1({
		  				place: fields.place,
		  				path: _this.form.uploadDir.replace(path.join(process.cwd(),"static"),"").replace(/\\/g,"/"),
		  				filename: avatarName,
		  				type: files.file.type,
		  				size: files.file.size
		  			});
		  		}
	    	}).then(null, function(err){
	    		fn2 ? fn2(err) : console.error(err);
	    	});
	    });
	    
	});
}
module.exports = Uploads;