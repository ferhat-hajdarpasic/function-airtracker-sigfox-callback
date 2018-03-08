var sql = require('mssql');

var db = require('../shared/db.js')();

module.exports = function (context, req) {
    context.res = {
        status: 500,
    };
    var request = db.request();        
    if(request) {
        request.input('device', sql.VarChar, '66')
            .query('select * from dbo.Sensors')
            .then(result => {
                context.log('result.recordset' + JSON.stringify(result.recordset));
                context.log('result.rowsAffected=' + result.rowsAffected);
                var response  = [];
                for(var i = 0; i < result.recordset.length; i++) {
                    response.push({
                        device: result.recordset[i].device, 
                        lat: result.recordset[i].lat,
                        lng: result.recordset[i].lng,
                        station: result.recordset[i].lng,
                        data: result.recordset[i].data
                    });
                }
                context.log('response =' + JSON.stringify(response));
                context.res = {
                    status: 200,
                    body: response,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                context.done();
            }).catch(err => {
                context.log("Catch Error="+ err);
                context.done();
            });
    } else {
        context.log('Ferhat:No db connection yet!');
        context.done();    
    }
}