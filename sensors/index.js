const sql = require('mssql')
var db = require('../shared/db.js')();

module.exports = function (context, req) {
    var request = db.request();        
    if(request) {
        request.input('device', sql.VarChar, '66')
            .query('select * from dbo.Sensors where device = @device')
            .then(result => {
                context.log('result.recordset' + JSON.stringify(result.recordset));
                context.log('result.rowsAffected=' + result.rowsAffected);
                if(result.rowsAffected == 0) {
                    context.log("Insert new row with request data");
                } else if(result.rowsAffected == 1) {
                    context.log("Update existing with request data");
                } else {
                    context.log("There cannot be more than 1 record.");
                }
            }).catch(err => {
                context.log("Catch Error="+ err);
            });
        var response  = [
            { 
            "lat": 51.508515,
            "lon": -0.125487,
            "city": "London",
            "content": "Just some <b>content</b>"
            },
            { 
                "lat": 52.370216,
            "lon": 4.895168,
            "city": "Amsterdam",
            "content": "More <i>content</i>"
            },
            { 
                "lat": 48.856614,
            "lon": 2.352222,
            "city": "Paris",
            "content": "Text here"
            }
        ];
        context.res = {
            status: 200,
            body: response,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        context.done();
    } else {
        context.log('Ferhat:No db connection yet!');
            context.res = {
                status: 500,
                body: 'No db connection yet!'
            };
        context.done();    
    }
}