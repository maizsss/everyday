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

module.exports = function(Router) {
    Router.get('/user', function(req, res, next) {
        if (req.query.type == 'login'){
            login(req, res, next);
        }
        if (req.query.type == 'logout'){
            logout(req, res, next);
        }
    });

    return Router;
};
