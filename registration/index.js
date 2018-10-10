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
                subject: `Registration received for ${req.query.name}`
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
        subject: `Registration received for ${req.query.name}`,
        content: [
            {
                type: "text/html",
                value: `<html><p>${req.query.name}</p><p>${req.query.email}</p></html>`
            }
        ]
    };

    if ((req.query.name && req.query.email) ||
        (req.body.name && req.body.email)) {

        request({
            url: "https://api.sendgrid.com/v3/mail/send",
            method: "POST",
            json: true,
            headers: {
                "Authorization": "Bearer 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",  
            },
            body: body
        }, function (error, response, body) {
            context.log(response);
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