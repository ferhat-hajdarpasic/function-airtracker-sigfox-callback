const sql = require('mssql')
var config = {  
    userName: process.env.DB_USERNAME,  
    password: process.env.DB_PASSWORD,  
    server: 'airtracker.database.windows.net',  
    port: 1433,
    options: {encrypt: true, database: 'airtracker-sensors-db'}
};
        let pool = await sql.connect(config);
        let result1 = await pool.request()
            .input('device', sql.String, value)
            .query('select * from dbo.Sensors where device = @device');

module.exports = function (context, req) {
    if(connection) {
        context.log('Ferhat:'+ process.env['SQLCONNSTR_airtracker-sensors-db']);
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