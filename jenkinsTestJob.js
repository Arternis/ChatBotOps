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
    var jobName = "JenkinsTest";
    var name = session.dialogData.Name;
    var value = session.dialogData.Value;

    console.log("Start to fill parameter name " + name + ", value " + value);

    //address is to store the skype session, so jenkins server can response to same dialog
    var address = JSON.stringify(session.message.address);
    var formData = {
        json: '{"parameter":[{"name":"ADDRESS", "value":\''+address+'\'}, {"name":"Name", "value":\"'+name+'\"}, {"name":"Value", "value":\"'+value+'\"}]}'
    };

    jenkinsService.triggerLocalJenkins(jobName, formData)
        .then(function (response) {
            session.endDialog("Trigger job done.");
        })
        .catch(function (error) { 
            handleErrorResponse(session, error); 
        });
}

function handleErrorResponse(session, error) {
    session.send('Oops! Something went wrong. Try again later.');
    console.error(error);
    session.endDialog();
}
