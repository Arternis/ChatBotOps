var builder = require('botbuilder');
var request = require('request');
var gerritService = require('./gerrit-service');
var Table = require('easy-table')

module.exports = [
    function (session, args, next) {
        builder.Prompts.text(session, "Please enter the change owner.");
    },
    function (session, results) {
        getStatusFromOwner(session, results.response);
    }
];
    

function getStatusFromOwner(session, owner) {
    session.send("Start to get status:open for " + owner);
    var changeInfo = gerritService.getOpenChanges(owner)
                    .then(function(response) {
                        var t = new Table;
                        for (var i=0; i<response.length; i++) {
                            t.cell('Patch number', response[i]._number);
                            t.cell('Project', response[i].project)
                            t.cell('Branch', response[i].branch)
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






