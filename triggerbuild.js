var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        builder.Prompts.text(session, "Please input change Ids or numbers. Separate by space. Max count is 4");
    },
    function (session, results) {
        session.send("Start to trigger build with change id = " + results.response);
        runscript(session, results.response);
    }
];

function runscript(session, content) {
  //var data = content.split(" ");

  var data = content.match(/\b(I[a-f0-9]{40})\b/g);

  if(!data) {
    data = content.match(/\d+/g);
  }

  if(!data || data.length > 4) {
    session.send("change count should <= 4");
    session.endDialog();
    return;
  }

  var PythonShell = require('python-shell');
  
  var options = {
    mode: 'text',
    pythonPath: '/usr/bin/python',
    scriptPath: './python',
    args: data
  };

  var shell = new PythonShell('triggerbuild.py', options);

  shell.on('message', function(message) {
    if (message.startsWith('There is no build pass project') ) {
        session.send(message);
    }
    else {
        console.log(message);
    }
  });

  shell.end(function(err) {
    if (err) {
        console.error(err);
        session.send("Run script failed.");
    } else {
        session.send("Trigger build done");
    }
    session.endDialog();
  });
  
}
