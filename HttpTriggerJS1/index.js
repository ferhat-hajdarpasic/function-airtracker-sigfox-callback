module.exports = function (context, req) {

    if (req.body) {
        context.log('Received = ' + JSON.stringify(req.body));
        context.res = {
            // status: 200, /* Defaults to 200 */ /*{"device":"1234", "data":"0", "station":"0001", "rssi":null, "duplicate":false}*/
        };
    } else {
        context.res = {
            status: 400,
        };
        context.log('Received no data in the body.');
    }
    context.done();
};