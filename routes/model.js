var mongoose = require("mongoose");
var msl = require("./link");
var Schema = mongoose.Schema;
var moment = require("moment");
var config = require("../config/config.json");
var deepPopulate = require("mongoose-deep-populate")(mongoose);

msl.config(config.db);

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
var Autoid = msl.db.model("Autoid", AutoidSchema);

// 权限
var PowerSchema = new Schema({
    "name": String,
    "url": [String],
    "api": [String],
    "createtime": {
        "type": Date,
        default: Date.now
    },
    "updatetime": {
        "type": Date,
        default: Date.now
    }
});
var Power = msl.db.model("Power", PowerSchema);

// 角色
var RoleSchema = new Schema({
    "name": String,
    "power": [{
        "type": Schema.Types.ObjectId,
        "ref": Power
    }],
    "createtime": {
        "type": Date,
        default: Date.now
    },
    "updatetime": {
        "type": Date,
        default: Date.now
    }
});
var Role = msl.db.model("Role", RoleSchema);

// 用户
var UserSchema = new Schema({
    "name": String,
    "pass": String,
    "email": String,
    "showname": String,
    "avatar": String,
    "role": {
        "type": Schema.Types.ObjectId,
        "ref": "Role"
    },
    "power": {
        "type": Schema.Types.ObjectId,
        "ref": "Power"
    },
    "createtime": {
        "type": Date,
        default: Date.now
    },
    "updatetime": {
        "type": Date,
        default: Date.now
    }
});
var User = msl.db.model("User", UserSchema);

// 字典
var DictSchema = new Schema({
    "pid": {
        "type": Schema.Types.ObjectId,
        "ref": "Dict"
    },
    "name": String,
    "alias": String,
    "type": String,
    "desc": String,
    "serial": {
        "type": Number,
        default: 0
    },
    "status": {
        "type": Number,
        default: 0
    },
    "createtime": {
        "type": Date,
        default: Date.now
    },
    "updatetime": {
        "type": Date,
        default: Date.now
    }
});
DictSchema.plugin(deepPopulate);
var Dict = msl.db.model("Dict", DictSchema);

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
        default: Date.now
    },
    "updatetime": {
        "type": Date,
        default: Date.now
    }
});
var Note = msl.db.model("Note", NoteSchema);

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
        default: Date.now
    }
});
var Comment = msl.db.model("Comment", CommentSchema);

// 评论
var FileSchema = new Schema({
    "place": String,
    "type": String,
    "upload_name": String,
    "file_name": String,
    "size": Number
});
var File = msl.db.model("File", FileSchema);

exports.Msl = msl;
exports.Autoid = Autoid;
exports.Power = Power;
exports.Role = Role;
exports.User = User;
exports.Dict = Dict;
exports.Note = Note;
exports.Comment = Comment;
exports.File = File;