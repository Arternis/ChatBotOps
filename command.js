var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        var msg = new builder.Message(session);
        msg.attachmentLayout(builder.AttachmentLayout.carousel)
        msg.attachments([
        new builder.HeroCard(session)
            .title("Tools")
            .buttons([
                builder.CardAction.imBack(session, "codepoint", "Code Point"),
                builder.CardAction.imBack(session, "shorturl", "Short Url"),
                builder.CardAction.imBack(session, "jenkinsJob", "Local Jenkins Job"),
                builder.CardAction.imBack(session, "pythonJob", "Local Python Job")
            ]), 
        new builder.HeroCard(session)
            .title("Git tools")
            .buttons([
                builder.CardAction.imBack(session, "addreviewer", "Add reviewer"),
                builder.CardAction.imBack(session, "triggerbuild", "Trigger build"),
                builder.CardAction.imBack(session, "changeinfo", "Patch Info"),
                builder.CardAction.imBack(session, "openchanges", "Open Changes")
            ])
        ]);

        builder.Prompts.choice(session, msg, "codepoint|addreviewer|triggerbuild|changeinfo|shorturl|jenkinsJob|pythonJob|openchanges");
    },
    function (session, results) {
        console.log("Start to run " + results.response.entity);
        var script = results.response.entity;

        switch(script) {
            case 'codepoint':
            session.beginDialog('codepoint');
            break;
            case 'addreviewer':
            session.beginDialog('addreviewer');
            break;
            case 'triggerbuild':
            session.beginDialog('triggerbuild');
            break;
            case 'changeinfo':
            session.beginDialog('changeinfo');
            break;
            case 'shorturl':
            session.beginDialog('shorturl');
            break;
            case 'jenkinsJob':
            session.beginDialog('jenkinsJob');
            break;
            case 'pythonJob':
            session.beginDialog('pythonJob');
            break;
            case 'openchanges':
            session.beginDialog('openchanges');
            break;
        }
    }, function (session, results) {
        console.log("Job done : " + results.response);
        session.replaceDialog('command');
    }
];

