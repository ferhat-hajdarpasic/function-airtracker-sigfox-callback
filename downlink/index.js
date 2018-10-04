var ftpsheet = require('../shared/ftp-sheet.js')();
module.exports = function (context, req) {
    context.log(' = ' + JSON.stringify(req.query));
    ftpsheet();
    context.res = {
        body: {
            '2BEED9': {
                    'downlinkData':'70117f61a5ceec67'
            }
        }
    };
    context.done();
};