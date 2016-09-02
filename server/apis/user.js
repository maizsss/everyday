var ouputJson = require('../util/ouputJson.js');
var md5 = require('md5');

var login = function (req, res, next){
    var User = global.db_handel.getModel('user');
    if(!req.query.account){
        ouputJson(req, res, { 
            "data": {
            },
            "msg": "参数不全",  
            "code": -1
        });
        return;
    } 

    User.find({account: req.query.account}).exec(function(err, docs) {
        if (err) {
            res.send(err);
        } else {
            if (docs.length == 0){ 
                ouputJson(req, res, { 
                    "data": {
                    },
                    "msg": "用户不存在",  
                    "code": -3
                });
                return;
            }
            if (md5(req.query.password) == docs[0].password){
                req.session.is_login = 1;
                req.session.account = docs[0].account;
                res.cookie('is_login', 1, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
            
                ouputJson(req, res, { 
                    "data": {
                        user: {
                            user_nickname: docs[0].user_nickname,
                            account: docs[0].account,
                            is_login: 1
                        }
                    },
                    "msg": "登录成功",  
                    "code": 0
                });
            } else {
                ouputJson(req, res, { 
                    "data": {
                    },
                    "msg": "密码错误",  
                    "code": -2
                });
            }
            
        }
    });
};

var logout = function (req, res, next){
    var User = global.db_handel.getModel('user');
    if(!req.query.account){
        ouputJson(req, res, { 
            "data": {
            },
            "msg": "参数不全",  
            "code": -1
        });
        return;
    } 

    req.session.is_login = 0;
    req.session.account = null;
    res.cookie('is_login', 0, { expires: 0});
    ouputJson(req, res, { 
        "data": {
            user: {
                user_nickname: '',
                account: '',
                is_login: 0
            }
        },
        "msg": "注销成功",  
        "code": 0
    });
};

var sign = function (req, res, next){
    if(!req.query.account || !req.query.user_nickname || !req.query.password){
        ouputJson(req, res, { 
            "data": {
            },
            "msg": "参数不全",  
            "code": -1
        });
        return;
    }
    var User = global.db_handel.getModel('user');
    User.find({ 'account': req.query.account }).exec(function(err, doc) {
        if (doc.length != 0) {
            ouputJson(req, res, { 
                "data": {
                },
                "msg": "账号已存在",  
                "code": -5
            });
            return;
        }
        User.find({ 'user_nickname': req.query.user_nickname }).exec(function(err, doc) {
            if (doc.length != 0) {
                ouputJson(req, res, { 
                    "data": {
                    },
                    "msg": "用户名已存在",  
                    "code": -6
                });
                return;
            }
            User.create({
                account: req.query.account,
                user_nickname: req.query.user_nickname,
                password: md5(req.query.password)
            }, function(err, doc) {
                if (err) {
                    ouputJson(req, res, { 
                        "data": {
                        },
                        "msg": "注册失败",  
                        "code": -7
                    });
                } else {
                    ouputJson(req, res, { 
                        "data": {
                        },
                        "msg": "注册成功",  
                        "code": 0
                    });
                }
            });
        });
        
    });

    
};

module.exports = function(Router) {
    Router.get('/user', function(req, res, next) {
        if (req.query.type == 'login'){
            login(req, res, next);
        }
        else if (req.query.type == 'logout'){
            logout(req, res, next);
        }
        else if (req.query.type == 'sign'){
            sign(req, res, next);
        }
        else {
            ouputJson(req, res, { 
                "data": {
                },
                "msg": "参数不全",  
                "code": -1
            });
        }
    });

    return Router;
};
