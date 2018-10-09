const ftp = require('basic-ftp');
const ftp1 = require('../shared/ftp-sheet.js');

module.exports = async function (context, req) {
    context.log(' = ' + JSON.stringify(req.body));

    let files = '';
    try {
        let client = new ftp.Client();
        await client.access({
            host: "waws-prod-dm1-081.ftp.azurewebsites.windows.net",
            user: "carbonblue\\carbonblue",
            password: "Carbon@Blue",
            secure: true
        });
        files = await client.list();
        context.log('Connected, files = ' + JSON.stringify(files));
    } catch(e) {
        message = e.message;
    }
    context.res = {
        body: {
            files: files
        }
    };
    context.done();
};