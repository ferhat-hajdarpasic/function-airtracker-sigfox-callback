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
    return {
        request: function() {
            if(connectionPool) {
                return connectionPool.request();
            }
        }
    };
}