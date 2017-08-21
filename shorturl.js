var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        builder.Prompts.text(session, "Please input url");
    },
    function (session, results) {
        getshorturl(session, results.response);
    }
];

function getshorturl(session, content) {
    var GoogleUrl = require('google-url');

    content = content.match(/(http(s)?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi);

    var url = content[0];
    if (!url || typeof url === 'undefined') {
        session.send("URL format is wrong.");
        session.endDialog();
        return ;
    }

    console.log("Start to short url for " + url);    

    googleUrl = new GoogleUrl({key: process.env.GOOGLE_SHORTURL_KEY});

    googleUrl.shorten(url, function(err, shortUrl) {
        if(err) {
            console.error(err);
            session.send("Shorted url failed.");
        } else {
            session.send("Shorted url: " + shortUrl);
        }
        session.endDialog();
    });
}
