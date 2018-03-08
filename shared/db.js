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

module.exports = function () {
    return {
        request: function() {
            if(connectionPool) {
                return connectionPool.request();
            }
        },
        transaction: function() {
            return new sql.Transaction(connectionPool);
        },
        uplink: function(device, data, station, rssi) {
            return new Promise(function(resolve, reject) {
                if(connectionPool) {
                    var dbRequest = connectionPool.request();
                    dbRequest.input('device', sql.VarChar, device)
                        .query('select * from dbo.Sensors where device = @device')
                        .then(result => {
                            if(result.rowsAffected == 0) {
                                var message = "Insert new row with uplink data";
                                var query = `insert into dbo.Sensors (device, data, station, rssi) values ('${device}', '${data}', '${station}', '${rssi}')`;
                            } else if(result.rowsAffected == 1) {
                                var message = "Update existing with uplink";
                                var query = `update dbo.Sensors set data='${data}', station = '${station}', rssi = '${rssi}' where device = '${device}'`;
                            }
            
                            if(query) {       
                                var transaction = new sql.Transaction(connectionPool);
                                transaction.begin().then(function () {
                                        dbRequest.query(query)
                                        .then(function () {
                                            transaction.commit().then(function (recordSet) {
                                                resolve(`Successful ${message} with query = ${query}`);                        
                                            }).catch(function (err) {
                                                reject("Error in Transaction Commit " + err);
                                            });
                                        }).catch(function (err) {
                                            reject("Error in query " + err);
                                        });
                                    }).catch(function (err) {
                                        reject("Error in Transaction Begin " + err);
                                    });                        
                            } else {
                                reject("There cannot be more than 1 record.");  
                            }
                        }).catch(err => {
                            reject(`Catch Error. Could not select the primary key='${device}'. `+ err);
                        }
                    );
                } else {
                    reject('No db connection yet!');
                }
            });
        },
        geolocation: function(device, lat, lng, radius) {
            return new Promise(function(resolve, reject) {
                if(connectionPool) {
                    var dbRequest = connectionPool.request();
                    dbRequest.input('device', sql.VarChar, device)
                        .query('select * from dbo.Sensors where device = @device')
                        .then(result => {
                            if(result.rowsAffected == 1) {
                                var message = "Update existing with geolocation data";
                                var query = `update dbo.Sensors set lat='${lat}', lng = '${lng}', radius = '${radius}' where device = '${device}'`;
                                var transaction = new sql.Transaction(connectionPool);
                                transaction.begin().then(function () {
                                    dbRequest.query(query)
                                    .then(function () {
                                        transaction.commit().then(function (recordSet) {
                                            resolve(`Successful ${message} with query = ${query}`);                        
                                        }).catch(function (err) {
                                            reject("Error in Transaction Commit " + err);
                                        });
                                    }).catch(function (err) {
                                        reject("Error in query " + err);
                                    });
                                }).catch(function (err) {
                                    reject("Error in Transaction Begin " + err);
                                });                        
                            } else {
                                reject(`Device ${device} not found.`);  
                            }
                        }).catch(err => {
                            reject(`Catch Error. Could not select the primary key='${device}'. `+ err);
                        }
                    );
                } else {
                    reject('No db connection yet!');
                }
            });
        }
    };
}