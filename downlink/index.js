let ftp = require('../shared/ftp.js');
let sheet = require('../shared/sheet.js');

async function processCsvFile(filename) {
    console.log(`Processing ${filename}`);
    let content = await ftp.download(filename);
    console.log(content);
    let [code, name, id, ...rest] = filename.split('-');
    let sheetName = `${code}-${name}`;
    console.log(`sheetName=${sheetName}`);
    let values = [];
    content.split('\n').forEach(line => {
        if(line) {
            console.log(`line=${line}`);
            values.push([code, name, ...line.split(';')]);
        }
    });
    sheet.write(values);    
};

module.exports = async function (context, req) {
    context.log(' = ' + JSON.stringify(req.body));
    context.log('GOOGLE_APPLICATION_CREDENTIALS='+context.executionContext.functionDirectory);

    await ftp.connect();
    await sheet.connect();
    let errorMessage = 'No error';
    let files = await ftp.listFiles();
    try {
        for(i = 0; i < files.length; i++ ) {
            let filename = files[i].name;
            if(filename.endsWith('.csv')) {
                try {
                await processCsvFile(filename);
                } catch(error) {
                    context.log(`Error: ${error}`);
                }
                context.log(`Processing successful, removing ${filename}`);
                await ftp.remove(filename);
                context.log(`Removing ${filename} successful`);
            }
        }
        ftp.close();
    } catch(error) {
        context.log(`Error: ${error}`);
        errorMessage = error;
    }

    context.res = {
        body: {
            error: process.env.GOOGLE_APPLICATION_CREDENTIALS
        }
    };
    context.done();
};