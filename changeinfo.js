var builder = require('botbuilder');
var request = require('request');
var gerritService = require('./gerrit-service');
var Table = require('easy-table')

module.exports = [
    function (session, args, next) {
            if (args) {
                session.dialogData.queryType = "number";
                var url = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.url');
                if (url) {
                    var number = getNumberFromURL(session.message.text.substring(url.startIndex, url.endIndex+1));
                    if (typeof number === 'undefined') {
                        session.send("This url is not valid, please try again.");
                        session.endDialog();
                    } else {
                        return next({response: [number]});
                    }
                }
                var patch_number = builder.EntityRecognizer.findAllEntities(args.intent.entities, 'patch_number');
                if (patch_number && patch_number.length > 0) {
                    var numbers = [];
                    patch_number.forEach(function(item) {numbers.push(item.entity);});
                    return next({response: numbers});
                }

                
                var patch_changeid = builder.EntityRecognizer.findEntity(args.intent.entities, 'changeid');
                if (patch_changeid) {
                    session.dialogData.queryType = "changeid";
                    return next({response: patch_changeid.entity});
                }
            }
            builder.Prompts.text(session, "Please enter the patch number to get Change info.");
    },
    function (session, results) {
        if (session.dialogData.queryType === 'number') {
            var patch_numbers;
            if (!Array.isArray(results.response)) {
                console.log(results.response);
                patch_numbers = results.response.match(/\d+/g);
            } else {
                patch_numbers = results.response;
            }
            console.log(patch_numbers);
            getStatusFromNumber(session, patch_numbers);

        } else if (session.dialogData.queryType === 'changeid') {
            var changeid = results.response;
            console.log(changeid);
            getStatusFromChangeID(session, changeid);

        }
    }
];

function getNumberFromURL(url) {
    var gitServer = process.env.GERRIT_SERVER;

    var regex = new RegExp('^' + gitServer + '(#\/c\/)?(([0-9]+))');
    var result = url.match(regex);

    console.log("find number " + result[3]);
    return result[3];
}
    

function getStatusFromNumber(session, patch_numbers) {
    session.send("Start to get status for " + patch_numbers);
    for (var i=0; i<patch_numbers.length; i++) {
        var changeInfo = gerritService.getChangeInfo(patch_numbers[i])
                        .then(function(response) {
                            var reply = "Patch number: " + response._number + "\n\n";
                            reply += "SubJect : " + response.subject + "\n\n"; 
                            reply += "Project : " + response.project + "\n\n";
                            reply += "Branch : " + response.branch + "\n\n";
                            reply += "clid : " + response.clid + "\n\n"; 
                            session.endDialog(reply);
                        })
                        .catch(function(error) {handleErrorResponse(session, error); });

    }
}

function getStatusFromChangeID(session, changeid) {
    session.send("Start to get status for " + changeid);
    var changeInfo = gerritService.getChangeInfoFromID(changeid)
                    .then(function(response) {
                        var t = new Table;
                        for (var i=0; i<response.length; i++) {
                            t.cell('Patch number', response[i]._number)
                            t.cell('Branch', response[i].branch)
                            t.cell('CLid', response[i].clid)
                            t.newRow()
                        }
                        console.log(t.print());
                        var msg = new builder.Message(session).textFormat(builder.TextFormat.plain).text(t.print());
                        session.endDialog(msg);
                    })
                    .catch(function(error) {handleErrorResponse(session, error); });

}

function handleErrorResponse(session, error) {
    session.send('Oops! Something went wrong. Try again later.');
    console.error(error);
    session.endDialog();
}






