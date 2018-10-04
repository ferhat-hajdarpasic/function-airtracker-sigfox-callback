//export GOOGLE_APPLICATION_CREDENTIALS=/home/ferhat/carbonblue/carbonblue.json
var http = require('http');
const { google } = require('googleapis');
let privatekey = require("./carbonblue.json");
let sheets = undefined;

async function connect() {
  const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/compute', 'https://www.googleapis.com/auth/spreadsheets']});
  const project = await google.auth.getDefaultProjectId();
  let token = await auth.getAccessToken();
  sheets = google.sheets({ version: 'v4', auth });
}

async function write(values) {
  var request = {
    spreadsheetId: '1Spih2Sfuc__OynvVcAqyfBSPbHjovA8T4lEqfTdu1IM',
    range: 'Sheet1!A1:K5',
    valueInputOption: 'USER_ENTERED',  // TODO: Update placeholder value.
    insertDataOption: 'INSERT_ROWS',  // TODO: Update placeholder value.
    resource: {
      majorDimension: 'ROWS',
      values: values
    }
  };
  const response = await sheets.spreadsheets.values.append(request);
  console.log(JSON.stringify(response.data, null, 2));
}

module.exports = {connect, write};