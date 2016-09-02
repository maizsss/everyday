var ouputJson = require('../util/ouputJson.js');
var md5 = require('md5');

module.exports = function(Router) {
    Router.get('/schedule', function (req, res, next) {
        var Schedule = global.db_handel.getModel('schedule');

        // User.create({
            
        // });

        if(req.query.sketch){
            if(!req.session.is_login || req.query.account != req.session.account){
                ouputJson(req, res, { 
                    "data": {
                    },
                    "msg": "尚未登录",  
                    "code": -4
                });
            }
            var new_date = new Date();
            var year = new_date.getFullYear().toString();
            var month = (new_date.getMonth() + 1).toString();
            var day = new_date.getDate().toString();
            var date_format = req.query.date ? req.query.date : (year + '-' + month + '-' + day);
            var max_id = 0;
            if(req.query.type == 'add'){

                Schedule
                    .find({
                        account: req.query.account,
                        create_date: date_format
                    })
                    .sort({'id': -1})
                    .limit(1)
                    .exec(function(err, doc) {
                        if (doc.length != 0) {
                            max_id = doc[0].id
                            
                        } else {
                            
                        }
                        Schedule.create({
                            id: max_id + 1,
                            account: req.query.account,
                            sort_index: 1,
                            sketch: req.query.sketch,
                            describe: req.query.describe,
                            create_date: date_format
                        }, function (err, doc){
                            if (err) {
                                ouputJson(req, res, { 
                                    "data": {
                                    },
                                    "msg": "新增条目失败",  
                                    "code": -10
                                });
                            } else {
                                ouputJson(req, res, { 
                                    "data": {
                                    },
                                    "msg": "OK",  
                                    "code": 0
                                });
                            }
                        });
                        
                    });
                
            }

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