var fs = require('fs')
var spendingPulse = require('mastercard-spending-pulse');
var MasterCardAPI = spendingPulse.MasterCardAPI;
var writeFile = true;

var config = {
    p12file: process.env.KEY_FILE || null,
    p12pwd: process.env.KEY_FILE_PWD || 'keystorepassword',
    p12alias: process.env.KEY_FILE_ALIAS || 'keyalias',
    apiKey: process.env.API_KEY || null,
    sandbox: process.env.SANDBOX || 'true',
}

var authentication = new MasterCardAPI.OAuth(config.apiKey, config.p12file, config.p12alias, config.p12pwd);
MasterCardAPI.init({
    sandbox: 'true' === config.sandbox,
    authentication: authentication
});

function writeObj(obj, file, callback) {
    fs.writeFile("www/data/" + file, JSON.stringify(obj), function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        callback();
    });
}

function dumpGasWeekly() {
    var requestData = {
        "CurrentRow": "1",
        "Offset": "25"
    };

    spendingPulse.GasWeekly.query(requestData,
        function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                if (writeFile) {
                    writeObj(data, "gasWeekly.json", function() {
                        console.log('done');
                    });
                }
            }
        });
}

function dumpSpendingPulse() {
    var requestData = {
        "Country": "US",
        "CurrentRow": "1",
        "Period": "Weekly",
        "Offset": "25"
    };

    spendingPulse.SpendingPulseReport.query(requestData,
        function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                if (writeFile) {
                    writeObj(data, "spendingPulse.json", function() {
                        console.log('done');
                    });
                }
            }
        });
}

function dumpSubscriptions() {
    var requestData = {
        "CurrentRow": "1",
        "Offset": "25"
    };
    spendingPulse.Subscription.query(requestData,
        function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                if (writeFile) {
                    writeObj(data, "subscriptions.json", function() {
                        console.log('done');
                    });
                }
            }
        });
}

function dumpParameters() {
    var requestData = {
        "CurrentRow": "1",
        "Offset": "25"
    };
    spendingPulse.Parameters.query(requestData,
        function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.error(error);
            }
            else {
                console.dir(data, { depth: null });
                if (writeFile) {
                    writeObj(data, "parameters.json", function() {
                        console.log('done');
                    });
                }
            }
        });
}

//writeFile = false;
dumpGasWeekly();
dumpSpendingPulse();
dumpSubscriptions();
dumpParameters();