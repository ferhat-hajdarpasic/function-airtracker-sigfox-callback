let ftp = require('./ftp.js');
let sheet = require('./sheet.js');

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

async function ftpsheet() {
    await ftp.connect();
    await sheet.connect();
    let files = await ftp.listFiles();
    try {
        for(i = 0; i < files.length; i++ ) {
            let filename = files[i].name;
            if(filename.endsWith('.csv')) {
                try {
                await processCsvFile(filename);
                } catch(error) {
                    console.log(`Error: ${error}`);
                }
                console.log(`Processing successful, removing ${filename}`);
                await ftp.remove(filename);
                console.log(`Removing ${filename} successful`);
            }
        }
        ftp.close();
    } catch(error) {
        console.log(`Error: ${error}`);
        process.exit();
    }
}