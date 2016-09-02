var route = require('express').Router();

var routes = ['./root.js', './init.js', './user.js', './schedule.js'];

module.exports = [];
routes.forEach(function(item) {
    module.exports.push(require(item)(route))
})