var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        console.log("changeid = " + session.userData['changeId'] + ", reviewer = " + session.userData['reviewer']);
        builder.Prompts.text(session, "Please input change Id.");
    },
    function (session, results) {
        session.send("change id = " + results.response);
        session.userData['changeId'] = results.response;
        builder.Prompts.text(session, "Please input reviewer.");
    }, 
    function (session, results) {
        console.log(session.message.sourceEvent.text);
        session.send("reviewer = " + results.response);
        session.userData['reviewer'] = session.message.sourceEvent.text;
        console.log("changeid = " + session.userData['changeId'] + ", reviewer = " + session.userData['reviewer']);
        runscript(session);
        session.send("Start to add reviewer " + session.userData['reviewer'] + " to " + session.userData['changeId']);
    }
];

function runscript(session) {

  var PythonShell = require('python-shell');

  var options = {
  mode: 'text',
    pythonPath: '/usr/bin/python',
    scriptPath: './python',
    args: [session.userData['changeId'], session.userData['reviewer'] ]
  };

  var py = new PythonShell('addreviewer.py', options);

  py.on('message', function(message) {
        console.log(message);
  });

  py.end(function(err) {
    if (err) {
        console.error(err);
        session.send("Run script failed.");
    } else {
        session.send("Add reviewer done.");
    }
    session.endDialog();
  });

}
