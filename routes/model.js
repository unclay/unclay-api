var mongooseShortLink = require("mongoose-short-link");
var Schema = mongooseShortLink.mongoose.Schema;

mongooseShortLink.config({
    "host": "localhost",
    "database": "bae",
    "user": "",
    "pass": "",
    "port": "27017"
});

// 自增id
var AutoidSchema = new Schema({
    "id": {
        "type": Number,
        default: 1
    },
    "name": String
});
AutoidSchema.static("findAndModify", function(type, cb) {
    return this.findOneAndUpdate({
        "name": type || ""
    }, {
        "$inc": {
            "id": 1
        }
    }, {
        "new": true,
        "upsert": true
    }, cb);
});
var Autoid = mongooseShortLink.db.model("Autoid", AutoidSchema);

// 权限
var PowerSchema = new Schema({
    "name": String,
    "url": [String],
    "api": [String],
    "createtime": {
        "type": Date,
        default: new Date()
    },
    "updatetime": {
        "type": Date,
        default: new Date()
    }
});
var Power = mongooseShortLink.db.model("Power", PowerSchema);

// 角色
var RoleSchema = new Schema({
    "name": String,
    "power": [{
        "type": Schema.Types.ObjectId,
        "ref": Power
    }],
    "createtime": {
        "type": Date,
        default: new Date()
    },
    "updatetime": {
        "type": Date,
        default: new Date()
    }
});
var Role = mongooseShortLink.db.model("Role", RoleSchema);

// 用户
var UserSchema = new Schema({
    "name": String,
    "pass": String,
    "email": String,
    "createtime": {
        "type": Date,
        default: new Date()
    },
    "updatetime": {
        "type": Date,
        default: new Date()
    },
    "showname": String,
    "avatar": String,
    "role": {
        "type": Schema.Types.ObjectId,
        "ref": "Role"
    },
    "power": {
        "type": Schema.Types.ObjectId,
        "ref": "Power"
    }
});
var User = mongooseShortLink.db.model("User", UserSchema);

// 字典
var DictSchema = new Schema({
	"id": Number,
    "pid": {
        "type": Schema.Types.ObjectId,
        "ref": "Dict"
    },
    "name": String,
    "alias": String,
    "type": String,
    "desc": String,
    "status": Number,
    "createtime": {
        "type": Date,
        default: new Date()
    },
    "updatetime": {
        "type": Date,
        default: new Date()
    }
});
var Dict = mongooseShortLink.db.model("Dict", DictSchema);

// 文章
var NoteSchema = new Schema({
    "title": String,
    "intro": String,
    "thumbnail": String,
    "content": String,
    "author": {
    	"type": Schema.Types.ObjectId,
    	"ref": "User"
    },
    "category": {
    	"type": Schema.Types.ObjectId,
    	"ref": "Dict"
    },
    "tag": [{
    	"type": Schema.Types.ObjectId,
    	"ref": "Dict"
    }],
    "seo_title": String,
    "sero_keywords": String,
    "seo_description": String,
    "seo_url": String,
    "status": {
    	"type": Number,
    	default: 0
    },
    "views": Number,
    "user": [{
    	"type": Schema.Types.ObjectId,
    	"ref": "User"
    }],
    "serial": {
    	"type": Number,
    	default: 0
    },
    "istop": {
    	"type": Number,
    	default: 0
    },
    "createtime": {
        "type": Date,
        default: new Date()
    },
    "updatetime": {
        "type": Date,
        default: new Date()
    }
});
var Note = mongooseShortLink.db.model("Note", NoteSchema);

// 评论
var CommentSchema = new Schema({
	"note": {
		"type": Schema.Types.ObjectId,
		"ref": "Note"
	},
	"user": {
		"type": Schema.Types.ObjectId,
		"ref": "User"
	},
	"content": String,
	"quote": {
		"type": Schema.Types.ObjectId,
		"ref": "Comment"
	},
	"createtime": {
        "type": Date,
        default: new Date()
    }
});
var Comment = mongooseShortLink.db.model("Comment", CommentSchema);

exports.Msl = mongooseShortLink;
exports.Autoid = Autoid;
exports.Power = Power;
exports.Role = Role;
exports.User = User;
exports.Dict = Dict;
exports.Note = Note;
exports.Comment = Comment;
exports.format = function(code, data){
	if( Object.prototype.toString.call(code) !== "[object Number]" ){
		data = code;
		code = 0;
	}
	return {
		"code": code,
		"data": data
	}
}