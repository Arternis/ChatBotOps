var builder = require('botbuilder');
var jenkinsService = require('./jenkins-service');

module.exports = [
    function (session, args) {
        builder.Prompts.text(session, "Hi, I am Testing job, Please enter the name.");
    },
    function (session, results) {
        session.dialogData.Name = results.response;
        session.send("name is " + session.dialogData.Name);
        builder.Prompts.text(session, "Please enter the value");
    },
    function (session, results) {
        session.dialogData.Value = results.response;
        session.send("value is " + session.dialogData.Value);
        startJob(session);
    }
];


function startJob(session) {
    var jobName = "PythonTest";
    var name = session.dialogData.Name;
    var value = session.dialogData.Value;

    console.log("Start to fill parameter name " + name + ", value " + value);

    //address is to store the skype session, so jenkins server can response to same dialog
    var address = JSON.stringify(session.message.address);
    var PythonShell = require('python-shell');

    data = [name, value];
  
    var options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',
        scriptPath: './python',
        args: data
    };

    var shell = new PythonShell('testpython.py', options);

    shell.on('message', function(message) {
        console.log(message);
    });

    shell.end(function(err) {
        if (err) {
            console.error(err);
            session.send("Run script failed.");
        } else {
        session.send("Run script done");
        }
        session.endDialog();
    });
}
