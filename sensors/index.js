const sql = require('mssql')
var config = {  
    user: process.env.DB_USERNAME,  
    password: process.env.DB_PASSWORD,  
    server: 'airtracker.database.windows.net',  
    database: 'airtracker-sensors',
    port: 1433,
    options: {encrypt: true}
};

var connectionPool;
sql.connect(config).then(pool => {
    connectionPool = pool;
    }).catch(err => {
        console.log("Catch Error="+ err);
    });
    
sql.on('error', err => {
    console.log("Error="+ err);
})

module.exports = function (context, req) {
        
    if(connectionPool) {
        connectionPool.request()
            .input('device', sql.VarChar, '66')
            .query('select * from dbo.Sensors where device = @device')
            .then(result => {
                context.log(result)
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