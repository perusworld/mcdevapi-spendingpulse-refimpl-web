var express = require('express');
var bodyParser = require('body-parser');

var fs = require('fs')
var app = express();
var spendingPulse = require('mastercard-spending-pulse');
var MasterCardAPI = spendingPulse.MasterCardAPI;

var dummyData = [];
var dummyDataFiles = ['www/data/gasWeekly.json', 'www/data/spendingPulse.json', 'www/data/subscriptions.json', 'www/data/parameters.json'];
dummyDataFiles.forEach(function(file) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        dummyData[file] = JSON.parse(data);
    });
});

var config = {
    p12file: process.env.KEY_FILE || null,
    p12pwd: process.env.KEY_FILE_PWD || 'keystorepassword',
    p12alias: process.env.KEY_FILE_ALIAS || 'keyalias',
    apiKey: process.env.API_KEY || null,
    sandbox: process.env.SANDBOX || 'true',
}

var useDummyData = null == config.p12file;
if (useDummyData) {
    console.log('p12 file info missing, using dummy data')
} else {
    console.log('has p12 file info, using MasterCardAPI')
    var authentication = new MasterCardAPI.OAuth(config.apiKey, config.p12file, config.p12alias, config.p12pwd);
    MasterCardAPI.init({
        sandbox: 'true' === config.sandbox,
        authentication: authentication
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('www'));

app.post('/gasWeekly', function(req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[0]]);
    } else {
        var requestData = {
            "CurrentRow": req.body.currentRow,
            "Offset": req.body.offset
        };

        spendingPulse.GasWeekly.query(requestData, function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.dir(error, { depth: null });
                res.json({
                    GasWeeklyList: {
                        Count: "0",
                        Message: "Success",
                        GasWeeklyArray: {
                            GasWeeklyRecord: []
                        }
                    }
                });
            }
            else {
                res.json(data);
            }
        });

    }
});

app.post('/spendingPulse', function(req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[1]]);
    } else {
        var requestData = {
            "Country": req.body.country,
            "CurrentRow": req.body.currentRow,
            "Period": req.body.period,
            "Offset": req.body.offset
        };
        spendingPulse.SpendingPulseReport.query(requestData, function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.dir(error, { depth: null });
                res.json({
                    SpendingPulseList: {
                        Count: "0",
                        Message: "Success",
                        SpendingPulseArray: {
                            SpendingPulseRecord: []
                        }
                    }
                });
            }
            else {
                res.json(data);
            }
        });

    }
});

app.post('/subscriptions', function(req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[2]]);
    } else {
        var requestData = {
            "CurrentRow": req.body.currentRow,
            "Offset": req.body.offset
        };
        spendingPulse.Subscription.query(requestData, function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.dir(error, { depth: null });
                res.json({
                    SubscriptionList: {
                        Count: "0",
                        Message: "Success",
                        SubscriptionArray: {
                            Subscription: []
                        }
                    }
                });
            }
            else {
                res.json(data);
            }
        });

    }
});

app.post('/parameters', function(req, res) {
    if (useDummyData) {
        res.json(dummyData[dummyDataFiles[3]]);
    } else {
        var requestData = {
            "CurrentRow": req.body.currentRow,
            "Offset": req.body.offset
        };
        spendingPulse.Parameters.query(requestData, function(error, data) {
            if (error) {
                console.error("An error occurred");
                console.dir(error, { depth: null });
                res.json({
                    ParameterList: {
                        Count: "0",
                        Message: "Success",
                        ParameterArray: {
                            Parameter: []
                        }
                    }
                });
            }
            else {
                res.json(data);
            }
        });

    }
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
