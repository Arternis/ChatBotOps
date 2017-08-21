var builder = require('botbuilder');

module.exports = [
    function (session) {
        builder.Prompts.text(session, "Please enter the job name.");
    },
    function (session, results) {
        var job = results.response.trim();
        //start job dialog
        startJob(session, job);
    },
    function (session, results) {
        session.endDialog();
    }, 
];


function startJob(session, job) {
    if (job.toLowerCase() == 'PythonTest'.toLowerCase()) {
        session.beginDialog('pythonTest');
    } else {
        session.send("Job " + job + " not support");
        session.endDialog();
    }
}


