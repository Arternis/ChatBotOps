var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  

//=========================================================
// Local Jenkins response
// header : address -- address to session, JobName  -- jobs name
//=========================================================
function local_jenkins(req, res, next) {
    var address = JSON.parse(req.headers['address']);
    console.log("Address = " + req.headers['address']);
    if (typeof address != 'undefined' && address != null) {
        var jobname = req.headers['jobname']
        console.log("jobname = " + jobname);
        if (jobname == 'JenkinsTest') {
            var name = req.headers['name'];
            var value = req.headers['value'];
            var reply = new builder.Message()
                    .address(address)
                    .text('response from local jenkins job JenkinsTest name = ' + name + ', value = ' + value);

            bot.send(reply);
        }
    }
    res.end("Hello, I am a bot.");
}

server.get('/local_jenkins', local_jenkins);

//=========================================================
// Bot Setup
//=========================================================
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_SECRET
});

global.connector = connector;

var bot = new builder.UniversalBot(connector, function (session) {
    if (session.message.text == 'help') {
        session.beginDialog('help');
    } else if (session.message.text == 'jenkinsJob') {
        session.beginDialog('jenkinsJob');
    } else if (session.message.text == 'pythonJob') {
        session.beginDialog('pythonJob');
    } else {
        session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
    }
});

server.post('/api/messages', connector.listen());

var entities = {
  'amp': '&',
  'apos': '\'',
  '#x27': '\'',
  '#x2F': '/',
  '#39': '\'',
  '#47': '/',
  'lt': '<',
  'gt': '>',
  'nbsp': ' ',
  'quot': '"'
}

function decodeHTMLEntities (text) {
  return text.replace(/&([^;]+);/gm, function (match, entity) {
    return entities[entity] || match
  })
}

bot.use({
    botbuilder: function (session, next) {
        var message = session.message;
        var address = message.address;
        if (address.channelId === "skype" && address.conversation.isGroup) {
            if (message.entities.length > 0) {
                var content = decodeHTMLEntities(message.text);
                message.entities.forEach(function (entity, index, arr) {
                    message.text = content.replace(entity.text, '').trim();
                });
                //console.log(message.text);
            }
        }

        next();
    }
});

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

//=========================================================
// Activity Events
//=========================================================

bot.on('conversationUpdate', function (message) {
   // Check for group conversations
    if (message.address.conversation.isGroup) {
        // Send a hello message when bot is added
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                            .address(message.address)
                            .text("Hello everyone!");
                    bot.send(reply);
                }
            });
        }

        // Send a goodbye message when bot is removed
        if (message.membersRemoved) {
            message.membersRemoved.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye");
                    bot.send(reply);
                }
            });
        }
    }
});

bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});

bot.on('deleteUserData', function (message) {
    // User asked to delete their data
});


//=========================================================
// Bots Middleware
//=========================================================

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
//bot.beginDialogAction('help', '/help', { matches: /^help/i });

//=========================================================
// Bots Dialogs
//=========================================================
//Help
bot.dialog('help', function (session) {
    session.replaceDialog('command');
}).triggerAction({
    matches: 'help'
});

bot.dialog('command', require('./command'))
.triggerAction({
    matches: 'command'
}).cancelAction('cancel', "OK, see you next time.", { 
    matches: /^cancel/i,
});

//Local services
bot.dialog('codepoint', require('./codepoint'))
.triggerAction({
    matches: 'codepoint',
});

bot.dialog('shorturl', require('./shorturl'))
.triggerAction({
    matches: 'shorturl'
}).cancelAction('cancel', "OK, see you next time.", { 
    matches: /^cancel/i,
});

bot.dialog('pythonJob', require('./pythonJob'))
.triggerAction({
    matches: 'pythonJob'
}).cancelAction('cancel', "OK, see you next time.", { 
    matches: /^cancel/i,
});

bot.dialog('pythonTest', require('./pythonTest'))
.triggerAction({
    matches: 'pythonTest'
}).cancelAction('cancel', "OK, see you next time.", { 
    matches: /^cancel/i,
});

//Gerrit services
bot.dialog('changeinfo', require('./changeinfo'))
.triggerAction({
    matches: 'changeinfo'
}).cancelAction('cancel', "OK, see you next time.", { 
    matches: /^cancel/i,
});

bot.dialog('addreviewer', require('./addreviewer'))
.triggerAction({
    matches: 'addreviewer'
}).cancelAction('cancel', "OK, see you next time.", { 
    matches: /^cancel/i,
});

bot.dialog('triggerbuild', require('./triggerbuild'))
.triggerAction({
    matches: 'triggerbuild'
}).cancelAction('cancel', "OK, see you next time.", { 
    matches: /^cancel/i,
});

//Jenkins services
bot.dialog('jenkinsJob', require('./jenkinsJob'))
.triggerAction({
    matches: 'jenkinsJob'
}).cancelAction('cancel', "OK, see you next time.", { 
    matches: /^cancel/i,
});

bot.dialog('jenkinsTest', require('./jenkinsTestJob'))
.triggerAction({
    matches: 'jenkinsTest'
}).cancelAction('cancel', "OK, see you next time.", { 
    matches: /^cancel/i,
});

bot.dialog('openchanges', require('./openchanges'))
.triggerAction({
    matches: 'openchanges'
}).cancelAction('cancel', "OK, see you next time.", { 
    matches: /^cancel/i,
});
