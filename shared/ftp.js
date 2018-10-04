const ftp = require('basic-ftp');
const streamBuffers = require('stream-buffers');

let client = undefined;
async function connect() {
    client = new ftp.Client()
    await client.access({
        host: "waws-prod-dm1-081.ftp.azurewebsites.windows.net",
        user: "carbonblue\\carbonblue",
        password: "Carbon@Blue",
        secure: true
    });
}

async function close() {
    client.close();
}

async function listFiles() {
    let files = await client.list();
    return files;
}

async function download(filename) {
    console.log(`Downloading ${filename}`);
    var writableStream = new streamBuffers.WritableStreamBuffer();
    await client.download(writableStream, filename);
    console.log(`Downloaded ${filename}`);
    return writableStream.getContentsAsString();
}

async function remove(filename) {
    await client.remove(filename);
}

module.exports = {connect, listFiles, download, remove, close};