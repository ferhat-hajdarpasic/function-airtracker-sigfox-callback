var db = require('../shared/db.js')();
module.exports = function (context, req) {
    context.log('req.body = ' + JSON.stringify(req.body));

    context.res = {
        status: 500
    };            

    if(req.body.device) {
        db.uplink(req.body.device, req.body.data, req.body.station, req.body.rssi)
        .then(function(message){
            context.log(message);
            context.res = {
                status: 200
            };
            context.done();      
        }).catch(function(message) {
            context.log(message);
            context.res = {
                status: 500
            };            
            context.done();      
        });
    } else {
        context.log('Received no data in the body.');
        context.done();    
    } 
};