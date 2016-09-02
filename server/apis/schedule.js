var ouputJson = require('../util/ouputJson.js');
var md5 = require('md5');

var scheduleAdd = function (req, res, next){
    var Schedule = global.db_handel.getModel('schedule');
    var new_date = new Date();
    var year = new_date.getFullYear().toString();
    var month = (new_date.getMonth() + 1).toString();
    var day = new_date.getDate().toString();
    var date_format = req.query.date ? req.query.date : (year + '-' + month + '-' + day);
    var max_id = 0;

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
};

var scheduleEdit = function (req, res, next){
    var Schedule = global.db_handel.getModel('schedule');

    Schedule
        .find({
            id: req.query.id,
            create_date: req.query.date,
            account: req.query.account
        })
        .exec(function (err, schedule){
            
            Schedule
                .findByIdAndUpdate({
                    _id: schedule[0]._id
                }, {
                    $set: {
                        sketch: req.query.sketch,
                        describe: req.query.describe
                    }
                }, function (err, doc){ 
                    if (err) {
                        ouputJson(req, res, { 
                            "data": {
                            },
                            "msg": "编辑条目失败",  
                            "code": -11
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
    
};

var scheduleDelete = function (req, res, next){
    var Schedule = global.db_handel.getModel('schedule');

    Schedule
        .find({
            id: req.query.id,
            create_date: req.query.date,
            account: req.query.account
        })
        .exec(function (err, schedule){
            
            Schedule
                .findByIdAndRemove({
                    _id: schedule[0]._id
                }, function (err, doc){ 
                    if (err) {
                        ouputJson(req, res, { 
                            "data": {
                            },
                            "msg": "删除条目失败",  
                            "code": -11
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
    
};

var scheduleFirst = function (req, res, next){
    var Schedule = global.db_handel.getModel('schedule');

    Schedule
        .find({
            id: req.query.id,
            create_date: req.query.date,
            account: req.query.account,

        })
        .exec(function (err, schedule){
            Schedule
                .find({
                    create_date: req.query.date,
                    account: req.query.account,
                })
                .sort({'sort_index': -1})
                .exec(function (err, schedule2){
                    console.log(schedule2);
                    Schedule
                        .findByIdAndUpdate({
                            _id: schedule[0]._id
                        }, {
                            $set: {
                                sort_index: schedule2[0].sort_index + 1,
                            }
                        }, function (err, doc){ 
                            if (err) {
                                ouputJson(req, res, { 
                                    "data": {
                                    },
                                    "msg": "优先条目失败",  
                                    "code": -11
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
        });
    
};

var scheduleComplete = function (req, res, next){
    var Schedule = global.db_handel.getModel('schedule');

    Schedule
        .find({
            id: req.query.id,
            create_date: req.query.date,
            account: req.query.account,

        })
        .exec(function (err, schedule){
            
            Schedule
                .findByIdAndUpdate({
                    _id: schedule[0]._id
                }, {
                    $set: {
                        sort_index: 0,
                    }
                }, function (err, doc){ 
                    if (err) {
                        ouputJson(req, res, { 
                            "data": {
                            },
                            "msg": "完成条目失败",  
                            "code": -11
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
};

module.exports = function(Router) {
    Router.get('/schedule', function (req, res, next) {

        var is_add_parmas = req.query.type == 'add' && req.query.sketch;
        var is_edit_parmas = req.query.type == 'edit' && req.query.id && req.query.date;
        var is_delete_parmas = req.query.type == 'delete' && req.query.id;
        var is_first_parmas = req.query.type == 'first' && req.query.id;
        var is_complete_parmas = req.query.type == 'complete' && req.query.id;

        if(is_add_parmas || is_edit_parmas || is_delete_parmas || is_first_parmas || is_complete_parmas){
            
            if(!req.session.is_login || req.query.account != req.session.account){
                ouputJson(req, res, { 
                    "data": {
                    },
                    "msg": "尚未登录",  
                    "code": -4
                });
                return;
            }
            
            if(req.query.type == 'add'){
                scheduleAdd(req, res, next);
            }

            if(req.query.type == 'edit'){
                scheduleEdit(req, res, next);
            }

            if(req.query.type == 'delete'){
                scheduleDelete(req, res, next);
            }

            if(req.query.type == 'first'){
                scheduleFirst(req, res, next);
            }

            if(req.query.type == 'complete'){
                scheduleComplete(req, res, next);
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