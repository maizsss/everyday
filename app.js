var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();

var mongoose = require('mongoose');
var pwd = __dirname;

var app = express();
var router = express.Router();
var port = 3030;

var routers = require('./server/apis/index.js');

global.db = mongoose.connect("mongodb://localhost:27017/everyday");
global.db_handel = require('./server/db/db_handel.js'); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'my every day',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    saveUninitialized: true,
    resave: true
}));

// 前台静态资源
app.use('/front', express.static(pwd + '/frond_stage/'));

// 前台页面
app.get('/', function(req, res, next) { 
    res.sendFile(pwd + '/frond_stage/index_ssr.html',{}); 
})

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

routers.forEach(function(Router) {
    app.use('/api/everyday/', Router);
})

app.listen(process.env.PORT || port, function (){
  if (process.env.PORT) {
    console.log('run in online');
  } else {
    console.log('run in localhost');
  }
  
});

module.exports = app;
