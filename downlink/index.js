module.exports = function (context, req) {
    context.log('Received = ' + JSON.stringify(req.query));
    context.res = {
        body: {
            '2BEED9': {
                    'downlinkData':'70117f61a5ceec67'
            }
        }
    };
    context.done();
};