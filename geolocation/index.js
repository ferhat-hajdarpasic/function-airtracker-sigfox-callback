module.exports = function (context, req) {
    context.log('Received = ' + JSON.stringify(req.query));
    context.res = {
        
    };
    context.done();
};