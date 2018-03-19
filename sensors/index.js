var request = require('request');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var body = {
        personalizations: [
            {
                to: [
                    {
                        email: "ferhat.hajdarpasic@live.com.au",
                        name: "Ferhat Hajdarpasic"
                    }
                ],
                subject: "Hello, World!"
            }
        ],
        from: {
            email: "fred.hajdarpasic@outlook.com",
            name: "Fred Hajdarpasic"
        },
        reply_to: {
            email: "fred.hajdarpasic@outlook.com",
            name: "Fred Hajdarpasic"
        },
        subject: "Hello, World!",
        content: [
            {
                type: "text/html",
                value: "<html><p>Hello, world!</p></html>"
            }
        ]
    };

    if ((req.query.name && req.query.email) ||
        (req.body.name && req.body.email)) {

        request({
            url: "https://api.sendgrid.com/v3/mail/send",
            method: "POST",
            json: true,
            body: body
        }, function (error, response, body) {
            console.log(response);
        });


        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done();
};