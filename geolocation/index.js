var db = require('../shared/db.js')();
module.exports = function (context, req) {
    var dbRequest = db.request();        
    context.log('req.body = ' + JSON.stringify(req.body));

    context.res = {
        status: 500
    };            

    if(req.body.device) {
        db.geolocation(req.body.device, req.body.lat, req.body.lng, req.body.radius)
        .then(function(message){
            context.log(message);
            context.res = {
                status: 200
            };            
        }).catch(function(message) {
            context.log(message);
            context.res = {
                status: 500
            };            
        });
    } else {
        context.log('Received no data in the body.');
        context.done();    
    } 
};