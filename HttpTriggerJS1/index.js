var sql = require('mssql');
var db = require('../shared/db.js')();
module.exports = function (context, req) {
    var dbRequest = db.request();        
    context.log('req.body = ' + JSON.stringify(req.body));

    context.res = {
        status: 500
    };            

    if(req.body.device) {
        if(dbRequest) {
            dbRequest.input('device', sql.VarChar, req.body.device)
                .query('select * from dbo.Sensors where device = @device')
                .then(result => {
                    context.log('result.recordset' + JSON.stringify(result.recordset));
                    context.log('result.rowsAffected=' + result.rowsAffected);
                    if(result.rowsAffected == 0) {
                        context.log("Insert new row with request data");
                        var query = `insert into dbo.Sensors (device, data, station, rssi) values ('${req.body.device}', '${req.body.data}', '${req.body.station}', '${req.body.rssi}')`;
                    } else if(result.rowsAffected == 1) {
                        context.log("Update existing with request data");
                        var query = `update dbo.Sensors set data='${req.body.data}', station = '${req.body.station}', rssi = '${req.body.rssi}' where device = '${req.body.device}'`;
                    } else {
                        context.log("There cannot be more than 1 record.");
                    }
    
                    if(query) {
                        context.log("query="+query);

                        var transaction = db.transaction();
                        transaction.begin().then(function () {
                                dbRequest.query(query)
                                .then(function () {
                                    transaction.commit().then(function (recordSet) {
                                        context.log("recordSet=" + JSON.stringify(recordSet));
                                        context.res = {
                                            status: 500
                                        };            
                                        context.done();                            
                                    }).catch(function (err) {
                                        context.log("Error in Transaction Commit " + err);
                                        context.done();                            
                                    });
                                }).catch(function (err) {
                                    context.log("Error in query " + err);
                                    context.done();                            
                                });
                            }).catch(function (err) {
                                context.log("Error in Transaction Begin " + err);
                                context.done();                            
                            });                        
                    } else {
                        context.done();                            
                    }
                }).catch(err => {
                    context.log(`Catch Error. Could not select the primary key='${req.body.device}'. `+ err);
                    context.done();    
                }
            );
        } else {
            context.log('No db connection yet!');
            context.done();    
        }
    } else {
        context.log('Received no data in the body.');
        context.done();    
    } 
};