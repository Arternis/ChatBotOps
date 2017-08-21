var request = require('request');

var LOCAL_JENKINS_SERVER = process.env.LOCAL_JENKINS_SERVER || "http://localhost/jenkins/job/";
var LOCAL_JENKINS_ID = process.env.LOCAL_JENKINS_ID;
var LOCAL_JENKINS_TOKEN = process.env.LOCAL_JENKINS_TOKEN;

var JENKINS_SERVER = process.env.JENKINS_SERVER;
var JENKINS_ID = process.env.JENKINS_ID;
var JENKINS_TOKEN = process.env.JENKINS_TOKEN;

function checkLocalJenkins() {
    return LOCAL_JENKINS_SERVER && LOCAL_JENKINS_ID && LOCAL_JENKINS_TOKEN;
}

function checkJenkins(){
    return JENKINS_SERVER && JENKINS_ID && JENKINS_TOKEN;
}

exports.triggerLocalJenkins = function(job, formData) {
    if (!checkLocalJenkins()) {
        console.log("local jenkins server variables not set");
        return;
    }

    var jenkinsURL = LOCAL_JENKINS_SERVER + job + "/build";

    var options = {
        url: jenkinsURL,
        method: 'POST',
        auth: {
            user: LOCAL_JENKINS_ID,
            pass: LOCAL_JENKINS_TOKEN
        },
        formData: formData
    };  

    return new Promise(
        function (resolve, reject) {

            request.post(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else if (response.statusCode !== 200 && response.statusCode !== 201) {
                    console.log(response.statusCode);
                    reject(body);
                }
                else {
                    console.log(body);
                    resolve(body);
                }
            });
        }
    );
}

exports.triggerJenkins = function(job, formData) {
    if (!checkJenkins()) {
        console.log("remote jenkins server variables not set");
        return;
    }

    var jenkinsURL = JENKINS_SERVER + job + "/build";

    var options = {
        url: jenkinsURL,
        method: 'POST',
        auth: {
            user: JENKINS_ID,
            pass: JENKINS_TOKEN
        },
        formData: formData
    };  

    return new Promise(
        function (resolve, reject) {

            request.post(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else if (response.statusCode !== 200 && response.statusCode !== 201) {
                    console.log(response.statusCode);
                    reject(body);
                }
                else {
                    console.log(body);
                    resolve(body);
                }
            });
        }
    );
}
