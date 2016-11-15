angular.module('spulse.api', [])


    .service('SPulseApi', ['$http', function ($http) {
        var ret = {
            getJson: function (file, callback) {
                $http.get('/mcdevapi-spendingpulse-refimpl-web/data/' + file).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    $http.get('/data/' + file).then(function successCallback(response) {
                        callback(response.data)
                    }, function errorCallback(response) {
                        callback(null);
                    });
                });
            },
            spendingPulse: function (req, callback) {
                var data = {
                    country: req.country,
                    currentRow: req.currentRow,
                    period: req.period,
                    offset: req.offset
                }
                $http.post('/spendingPulse', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("spendingPulse.json", callback);
                });
            },
            gasWeekly: function (req, callback) {
                var data = {
                    currentRow: req.currentRow,
                    offset: req.offset
                }
                $http.post('/gasWeekly', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("gasWeekly.json", callback);
                });
            },
            subscriptions: function (req, callback) {
                var data = {
                    currentRow: req.currentRow,
                    offset: req.offset
                }
                $http.post('/subscriptions', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("subscriptions.json", callback);
                });
            },
            parameters: function (req, callback) {
                var data = {
                    currentRow: req.currentRow,
                    offset: req.offset
                }
                $http.post('/parameters', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("parameters.json", callback);
                });
            }
        };
        return ret;

    }]);

