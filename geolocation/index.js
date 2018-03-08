var db = require('../shared/db.js')();
module.exports = function (context, req) {
    context.log('req.query = ' + JSON.stringify(req.query));
    context.res = {
        status: 500
    };            

    if(req.query.device) {
        db.geolocation(req.query.device, req.query.lat, req.query.lng, req.query.radius)
        .then(function(message){
            context.log(message);
            context.res = {
                status: 200
            };            
            context.done();    
        }).catch(function(message) {
            context.log(message);
            context.done();    
        });
    } else {
        context.log('Received no data in the query.');
        context.done();    
    } 
};