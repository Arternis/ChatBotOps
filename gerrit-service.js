var request = require('request');

var username = process.env.GERRIT_ID;
var password = process.env.GERRIT_TOKEN;
var gitServer = process.env.GERRIT_SERVER;

exports.getCherryPick = function(patch_number, id) {
    var reviewURL = gitServer + "a/changes/" + patch_number + "?o=CURRENT_REVISION&o=DOWNLOAD_COMMANDS";

    var options = {
        url: reviewURL,
        auth: {
            user: username,
            pass: password,
            sendImmediately: false
        }
    };

    return new Promise(
        function (resolve, reject) {
            request(options, function (error, response, body) {
                if (error) {
                    reject(error);
                    return;
                }
                else if (response.statusCode !== 200) {
                    console.log(response.statusCode);
                    reject(error);
                }
                else {
                    var changeJSON = JSON.parse(body.replace(")]}'", ""));
                    if (changeJSON) {
                        resolve([id, changeJSON.revisions[changeJSON.current_revision].fetch.ssh.commands['Cherry-Pick']]);
                    } else {
                        reject("Parse change info error.");
                    }
                }
            });
        }
    );
}

exports.getChangeInfo = function(patch_number) {
    var reviewURL = gitServer + "a/changes/" + patch_number;

    var options = {
        url: reviewURL,
        auth: {
            user: username,
            pass: password,
            sendImmediately: false
        }
    };

    return new Promise(
        function (resolve, reject) {
            request(options, function (error, response, body) {
                if (error) {
                    reject(error);
                    return;
                }
                else if (response.statusCode !== 200) {
                    console.log(response.statusCode);
                    reject(error);
                }
                else {
                    var changeJSON = JSON.parse(body.replace(")]}'", ""));
                    if (changeJSON) {
                        resolve(changeJSON);
                    } else {
                        reject("Parse change info error.");
                    }
                }
            });
        }
    );
}

exports.getChangeInfoFromID = function(changeid) {
    var reviewURL = gitServer + "a/changes/?q="+changeid;

    var options = {
        url: reviewURL,
        auth: {
            user: username,
            pass: password,
            sendImmediately: false
        }
    };

    return new Promise(
        function (resolve, reject) {
            request(options, function (error, response, body) {
                if (error) {
                    reject(error);
                    return;
                }
                else if (response.statusCode !== 200) {
                    console.log(response.statusCode);
                    reject(error);
                }
                else {
                    var changeJSON = JSON.parse(body.replace(")]}'", ""));
                    if (changeJSON) {
                        resolve(changeJSON);
                    } else {
                        reject("Parse change info error.");
                    }
                }
            });
        }
    );
}

exports.getOpenChanges = function(owner) {
    var reviewURL = gitServer + "a/changes/?q=is:open+owner:" + owner;

    var options = {
        url: reviewURL,
        auth: {
            user: username,
            pass: password,
            sendImmediately: false
        }
    };

    return new Promise(
        function (resolve, reject) {
            request(options, function (error, response, body) {
                if (error) {
                    reject(error);
                    return;
                }
                else if (response.statusCode !== 200) {
                    console.log(response.statusCode);
                    reject(error);
                }
                else {
                    var changeJSON = JSON.parse(body.replace(")]}'", ""));
                    if (changeJSON) {
                        resolve(changeJSON);
                    } else {
                        reject("Parse change info error.");
                    }
                }
            });
        }
    );
}



