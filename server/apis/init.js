var ouputJson = require('../util/ouputJson.js');
var md5 = require('md5');

module.exports = function(Router) {
    Router.get('/init', function (req, res, next) {
        var User = global.db_handel.getModel('user');
        var Schedule = global.db_handel.getModel('schedule');

        var schedule_list = [
            // {
            //     id: 20168301,
            //     sort_index: 2, //(0:已完成，非0:未完成)
            //     sketch: '事务一',
            //     describe: 'XXX需要完成'
            // },
        ];

        if(req.query.account){
            if(!req.session.is_login || req.query.account != req.session.account){
                ouputJson(req, res, { 
                    "data": {
                    },
                    "msg": "尚未登录",  
                    "code": -4
                });
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
                    var new_date = new Date();
                    var year = new_date.getFullYear().toString();
                    var month = (new_date.getMonth() + 1).toString();
                    var day = new_date.getDate().toString();
                    var date_format = req.query.date ? req.query.date : (year + '-' + month + '-' + day);
                    Schedule
                        .find({
                            account: req.query.account,
                            create_date: date_format
                        })
                        .sort({'sort_index': -1})
                        .exec(function(err, list) {
                            if (list.length != 0){
                                schedule_list = list;
                            }
                            ouputJson(req, res, { 
                                "data": {
                                    user: {
                                        account: docs[0].account,
                                        user_nickname: docs[0].user_nickname,
                                        is_login: 1
                                    },
                                    schedule: {
                                        list: schedule_list,
                                        total: schedule_list.length,
                                        date: date_format
                                    } 
                                },
                                "msg": "OK",  
                                "code": 0
                            });
                        });
                    
                    
                }
            });

        } else {
            ouputJson(req, res, {
                "data": {},
                "msg": "参数不全",
                "code": -1
            });
        } 
      
    });
    return Router;
};