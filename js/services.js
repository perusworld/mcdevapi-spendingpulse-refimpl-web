angular.module('spulse.services', [])

    .factory('SPulseService', function ($window, SPulseApi) {
        var ret = {
            chartData: function (req) {
                var retData = {
                    chart: {
                        sectors: []
                    }
                };
                req.data.reduce(function (total, dtl) {
                    if (-1 == retData.chart.sectors.indexOf(dtl[req.field])) {
                        retData.chart.sectors.push(dtl[req.field]);
                        total += 1;
                    }
                    return total;
                });
                retData.chart.height = Math.round($window.innerHeight / retData.chart.sectors.length) - 100;
                retData.chartData = retData.chart.sectors.map(function (sector) {
                    var sectorData = [];
                    req.arr.forEach(function (value) {
                        sectorData[value] = [];
                    });
                    req.data.forEach(function (dtl) {
                        if (sector === dtl[req.field]) {
                            req.arr.forEach(function (value) {
                                sectorData[value].push([moment(dtl[req.xField], 'MM/DD/YYYY').valueOf(), dtl[value]]);
                            });
                        }
                    });
                    return {
                        title: sector,
                        data: req.arr.map(function (value) {
                            return {
                                "key": (req.sectorPrefix[req.arr.indexOf(value)] ? sector + " " : "") + req.arrTitle[req.arr.indexOf(value)],
                                "bar": req.arrBar[req.arr.indexOf(value)],
                                "values": sectorData[value].slice()
                            }

                        })
                    };
                });
                return retData;
            },
            spendingPulse: function (req, callback) {
                SPulseApi.spendingPulse(req, function (data) {
                    if (null != data) {
                        callback(data.SpendingPulseList.SpendingPulseArray.SpendingPulseRecord);
                    }
                });
            },
            gasWeekly: function (req, callback) {
                SPulseApi.gasWeekly(req, function (data) {
                    if (null != data) {
                        callback(data.GasWeeklyList.GasWeeklyArray.GasWeeklyRecord);
                    }
                });
            },
            subscriptions: function (req, callback) {
                SPulseApi.subscriptions(req, function (data) {
                    if (null != data) {
                        callback(data.SubscriptionList.SubscriptionArray.Subscription);
                    }
                });
            },
            parameters: function (req, callback) {
                SPulseApi.parameters(req, function (data) {
                    if (null != data) {
                        callback(data.ParameterList.ParameterArray.Parameter);
                    }
                });
            }
        };
        return ret;
    });
