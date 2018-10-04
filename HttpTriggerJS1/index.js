var querystring = require('querystring');
module.exports = function (context, req) {
    context.log('payload = ' + JSON.stringify(req.body));

    context.res = {
        status: 500
    };            

    if(req.body.device) {
        context.res = {
            status: 200
        };
        context.done();      
    } else {
        context.log('Received no data in the body.');
        context.done();    
    } 
};