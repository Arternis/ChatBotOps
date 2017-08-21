var request = require('request-promise').defaults({ encoding: null });

exports.getImageStreamFromMessage = function(message) {
    var headers = {};
    var attachment = message.attachments[0];
    if (checkRequiresToken(message)) {
        global.connector.getAccessToken(function (error, token) {
            var tok = token;
            headers['Authorization'] = 'Bearer ' + token;
            headers['Content-Type'] = 'application/octet-stream';

            return request.get({ url: attachment.contentUrl, headers: headers });
        });
    }

    headers['Content-Type'] = attachment.contentType;
    return request.get({ url: attachment.contentUrl, headers: headers });
}

function checkRequiresToken(message) {
    return message.source === 'skype' || message.source === 'msteams';
}

exports.hasImageAttachment = function(session) {
    return session.message.attachments.length > 0 &&
        session.message.attachments[0].contentType.indexOf('image') !== -1;
}

