module.exports = function(Router) {
    Router.get('/root', function(req, res, next) {
        res.send({code: 0, data: 123, msg: 'OK'});
    });
    return Router;
};