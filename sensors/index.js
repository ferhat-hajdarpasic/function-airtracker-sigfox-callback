module.exports = function (context, req) {
    var response  = [
    { 
    "lat": 51.508515,
    "lon": -0.125487,
    "city": "London",
    "content": "Just some <b>content</b>"
    },
    { 
        "lat": 52.370216,
    "lon": 4.895168,
    "city": "Amsterdam",
    "content": "More <i>content</i>"
    },
    { 
        "lat": 48.856614,
    "lon": 2.352222,
    "city": "Paris",
    "content": "Text here"
    }
];
        context.res = {
            status: 200,
            body: response,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    context.done();
};