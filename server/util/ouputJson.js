
var ouputJson = function (req, res, data){
    if(req.query.debug == 1){
        data = JSON.stringify(data, null, 4);
        res.type('json');  
        res.send(data); 
    } else {
        res.jsonp(data);
    }
}
module.exports = ouputJson;